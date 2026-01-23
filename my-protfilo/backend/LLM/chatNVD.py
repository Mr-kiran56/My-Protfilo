from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.output_parsers import StrOutputParser
from .promptTemplate import unified_medical_prompt
from .vectorRetriever import get_retriever


def generate_responce(
    context: str,                      
):
    llm = ChatNVIDIA(
        model="meta/llama-3.1-8b-instruct",
        temperature=0.1,
        max_tokens=7000
    )

    prompt = unified_medical_prompt()

    chain = (
        prompt
        | llm
        | StrOutputParser()
    )

    return chain.invoke({
        "context": context,
    })


