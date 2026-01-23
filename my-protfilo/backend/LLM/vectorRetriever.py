from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from langchain_pinecone import PineconeVectorStore


INDEX_NAME = "profile-data"

def get_retriever(filename: str):


    embeddings = NVIDIAEmbeddings()
    namespace = filename.replace(".", "_").lower()

    vectorstore = PineconeVectorStore(
        index_name=INDEX_NAME,
        embedding=embeddings,
        namespace=namespace
    )

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 6}
    )

    return retriever


