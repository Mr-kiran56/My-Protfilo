from typing_extensions import TypedDict, Annotated
import operator
import os

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore

from backend.LLM.vectorRetriever import get_retriever
from backend.LLM.promptTemplate import unified_profile_prompt


# =========================
# LOAD ENV
# =========================
load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))


# =========================
# STATE
# =========================
class State(TypedDict):
    messages: Annotated[list, operator.add]


# =========================
# BUILD CHATBOT
# =========================
def build_portfolio_chatbot(username: str):

    #  STREAMING ENABLED
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

    # =====================
    # AGENT NODE (REAL STREAMING)
    # =====================
    def agent(state: State):

        question = state["messages"][-1].content

        # ---- MEMORY ----
        memories = long_memory.search(
            ("user_facts",),
            query=question,
            limit=3
        )

        memory_context = (
            "\n".join(f"- {m.value}" for m in memories)
            if memories else ""
        )

        # ---- RAG ----
        docs = retriever.invoke(question)
        rag_context = "\n\n".join(d.page_content for d in docs)

        # ---- FINAL CONTEXT ----
        final_context = f"""
User Question:
{question}

Past User Memory:
{memory_context}

Retrieved Documents:
{rag_context}
"""

        # ---- PROMPT TEXT ----
        prompt_text = prompt.format(
            context=final_context,
            username=username
        )

        #  REAL-TIME PRINTING HAPPENS HERE
        print("\nAssistant: ", end="", flush=True)

        full_response = ""
        for chunk in llm.stream(prompt_text):
            if chunk.content:
                print(chunk.content, end="", flush=True)   # ← REAL-TIME PRINT
                full_response += chunk.content

        print("\n")  # newline after completion

        return {"messages": [full_response]}

    # =====================
    # LANGGRAPH
    # =====================
    graph = (
        StateGraph(State)
        .add_node("agent", agent)
        .add_edge(START, "agent")
        .add_edge("agent", END)
        .compile(
            checkpointer=short_memory,
            store=long_memory
        )
    )

    # =====================
    # SEED MEMORY
    # =====================
    long_memory.put(("user_facts",), "m1", "User is a final-year engineering student")
    long_memory.put(("user_facts",), "m2", "User works with AI, ML, and GenAI")
    long_memory.put(("user_facts",), "m3", "User prefers structured professional answers")

    # =====================
    # STREAMING CHAT
    # =====================

    def chat_stream(question: str):
        graph.invoke(
            {"messages": [HumanMessage(content=question)]},
            {"configurable": {"thread_id": "portfolio"}}
        )

    return chat_stream




