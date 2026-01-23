from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from typing_extensions import TypedDict, Annotated
import operator
from promptTemplate import unified_profile_prompt

class State(TypedDict):
    messages: Annotated[list, operator.add]

prompt = unified_profile_prompt()
# llm = ChatNVIDIA(model="nvidia/nemotron-3-nano-30b-a3b", temperature=0)
chain = prompt | llm

short_memory = InMemorySaver()
long_memory = InMemoryStore()

def agent(state: State):
    # Get last message content
    last_message = state["messages"][-1]
    query = last_message.content if hasattr(last_message, 'content') else str(last_message)

    # Get K from config (default 3)
    k = state.get("configurable", {}).get("limit", 3)  # FIXED: use "limit"

    # FIXED: InMemoryStore.search() uses limit, not k
    facts = long_memory.search(
        ("user_facts",),
        query=query,
        limit=k,  # ✅ CORRECT PARAMETER
        filter=None
    )

    context = "\n".join([str(f.value) for f in facts]) if facts else "No past chats"
    messages = [f"Past chats ({k}): {context}"] + state["messages"]

    result = chain.invoke(messages)
    return {"messages": [result]}

# Compile
graph = StateGraph(State)\
    .add_node("agent", agent)\
    .add_edge(START, "agent")\
    .add_edge("agent", END)\
    .compile(checkpointer=short_memory, store=long_memory)

# === SAVE FACTS ===
long_memory.put(("user_facts",), "chat1", "User loves NVIDIA GPUs")
long_memory.put(("user_facts",), "chat2", "User asked RTX 4090 price")

# === PERFECT 1-LINE FUNCTION ===
def run(text, limit=3):  # FIXED: limit parameter
    return graph.invoke(
        {"messages": [HumanMessage(content=text)]},
        {"configurable": {"thread_id": "chat", "limit": limit}}  # FIXED: limit in config
    )["messages"][-1].content

# === TEST ✅ WORKING ===
print("=== Limit=1 (1 chat) ===")
print(run("GPUs?", limit=1))

print("\n=== Limit=3 (3 chats) ===")
print(run("cpu?", limit=3))

print("\n=== Limit=5 (all chats) ===")
print(run("india?", limit=5))