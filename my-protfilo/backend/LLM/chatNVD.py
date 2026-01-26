import os
import operator
from typing_extensions import TypedDict, Annotated
from dotenv import load_dotenv

from langchain_core.runnables import RunnableConfig  # <--- IMPORT
from langchain_core.messages import HumanMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore

from backend.LLM.vectorRetriever import get_retriever
from backend.LLM.promptTemplate import unified_profile_prompt

load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))

# --- GRAPH STATE ---
class State(TypedDict):
    messages: Annotated[list, operator.add]

# --- GLOBAL BUILDER ---
def get_graph_for_user(username: str):
    print(f"--> [DEBUG] Compiling Graph for: {username}")
    
    llm = ChatNVIDIA(
        model="meta/llama-3.1-8b-instruct",
        temperature=0.1,
        max_completion_tokens=4096,
        streaming=True
    )
    retriever = get_retriever()
    prompt = unified_profile_prompt()
    
    short_memory = InMemorySaver()
    long_memory = InMemoryStore()

    # 1. UPDATE AGENT TO ACCEPT CONFIG
    async def agent(state: State, config: RunnableConfig):
        print(f"--> [DEBUG] Agent Node Running for {username}...")
        question = state["messages"][-1].content
        
        try:
            # We don't need to stream retrieval, so no config needed here
            docs = await retriever.ainvoke(question)
            rag_context = "\n\n".join(d.page_content for d in docs)
            print(f"--> [DEBUG] Found {len(docs)} docs.")
        except Exception as e:
            print(f"--> [ERROR] Retrieval Failed: {e}")
            rag_context = "No information found due to error."

        final_context = f"User Question: {question}\n\nContext: {rag_context}"
        prompt_text = prompt.format(context=final_context, username=username)
        
        print("--> [DEBUG] Generating LLM response...")
        
        # ---------------------------------------------------------
        # 2. CRITICAL FIX: PASS 'config' HERE
        # This connects the LLM stream to the Graph stream events
        # ---------------------------------------------------------
        response = await llm.ainvoke(prompt_text, config)
        
        print("--> [DEBUG] LLM Response generated.")
        return {"messages": [response]}

    graph = (
        StateGraph(State)
        .add_node("agent", agent)
        .add_edge(START, "agent")
        .add_edge("agent", END)
        .compile(checkpointer=short_memory, store=long_memory)
    )
    
    return graph

# --- MAIN FUNCTION ---
def build_portfolio_chatbot(username: str):
    
    try:
        graph = get_graph_for_user(username)
    except Exception as e:
        error_msg = str(e)
        print(f"--> [CRITICAL ERROR] Graph Compilation Failed: {error_msg}")
        async def error_stream(q): 
            yield f"System Error: {error_msg}"
        return error_stream

    async def chat_stream(question: str):
        print(f"\n--> [DEBUG] STREAM STARTED: {question}")
        yield " " 
        
        has_streamed_text = False

        try:
            async for event in graph.astream_events(
                {"messages": [HumanMessage(content=question)]},
                {"configurable": {"thread_id": "portfolio"}},
                version="v2"
            ):
                kind = event["event"]
                
                # Capture standard Chat Model Stream
                if kind == "on_chat_model_stream":
                    chunk = event["data"]["chunk"]
                    if hasattr(chunk, "content") and chunk.content:
                        has_streamed_text = True
                        yield chunk.content
                
                # Capture Generic LLM Stream (Just in case)
                elif kind == "on_llm_stream":
                    chunk = event["data"]["chunk"]
                    if chunk:
                        # Convert chunk to string safely
                        text_chunk = str(chunk).replace("content='", "").replace("'", "")
                        has_streamed_text = True
                        yield text_chunk

                # Fallback only if stream failed
                elif kind == "on_chain_end" and event["name"] == "agent":
                    if not has_streamed_text:
                        output = event["data"].get("output")
                        if output and "messages" in output:
                            final_msg = output["messages"][-1]
                            if hasattr(final_msg, "content") and final_msg.content:
                                print("--> [DEBUG] Fallback: Yielding full response.")
                                yield final_msg.content
                                has_streamed_text = True

        except Exception as e:
            loop_err = str(e)
            print(f"--> [ERROR] Streaming Failed: {loop_err}")
            yield f"\n[System Error: {loop_err}]"
            
        print("\n--> [DEBUG] STREAM ENDED.")

    return chat_stream