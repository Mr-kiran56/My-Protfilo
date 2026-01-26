import os
import time
import requests
from dotenv import load_dotenv

from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from pathlib import Path
from fileProcessing import file_process  # Ensure this file exists

# ================= ENV =================
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

if not PINECONE_API_KEY:
    raise RuntimeError("PINECONE_API_KEY not loaded")

if not NVIDIA_API_KEY:
    raise RuntimeError("NVIDIA_API_KEY not loaded")

# ================= CONFIG =================
INDEX_NAME = "profile-data"
DIMENSION = 4096  # <--- FIXED: Updated from 1024 to 4096
METRIC = "cosine"

BATCH_SIZE = 30
MAX_RETRIES = 3
RETRY_SLEEP = 5 


# ================= PINECONE SETUP =================
def ensure_index_exists(pc: Pinecone):
    # Get list of existing indexes
    indexes = pc.list_indexes()
    index_names = [i.name for i in indexes]

    if INDEX_NAME in index_names:
        # CHECK IF DIMENSION IS CORRECT
        print(f"🔍 Checking existing index '{INDEX_NAME}'...")
        existing_index = pc.describe_index(INDEX_NAME)
        
        if existing_index.dimension != DIMENSION:
            print(f"⚠️  Dimension Mismatch! Existing: {existing_index.dimension}, Required: {DIMENSION}")
            print(f"🔥 Deleting old index '{INDEX_NAME}'...")
            pc.delete_index(INDEX_NAME)
            
            # Wait for deletion to finish
            while INDEX_NAME in [i.name for i in pc.list_indexes()]:
                time.sleep(2)
            print("✅ Old index deleted.")
        else:
            print(f"✅ Index '{INDEX_NAME}' exists and is correct.")
            return

    # Create if not exists (or if we just deleted it)
    print(f"🏗️  Creating new index '{INDEX_NAME}' with dimension {DIMENSION}...")
    pc.create_index(
        name=INDEX_NAME,
        dimension=DIMENSION,
        metric=METRIC,
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )
    
    # Wait for creation
    while INDEX_NAME not in [i.name for i in pc.list_indexes()]:
        time.sleep(1)
    print(f"✅ Pinecone index '{INDEX_NAME}' created/ready.")


# ================= INGESTION LOGIC =================
def ingest_in_batches(docs, vectorstore):
    total = len(docs)
    batch_no = 1

    for i in range(0, total, BATCH_SIZE):
        batch = docs[i:i + BATCH_SIZE]
        
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                print(f"🔹 Batch {batch_no} | Uploading docs {i} to {i + len(batch)}...")
                vectorstore.add_documents(batch)
                print(f"   ✅ Batch {batch_no} success.")
                break
            except Exception as e:
                print(f"   ⚠️ Connection error (attempt {attempt}/{MAX_RETRIES}): {e}")
                if attempt == MAX_RETRIES:
                    raise RuntimeError("Failed to upload batch after retries") from e
                time.sleep(RETRY_SLEEP)
        
        batch_no += 1


def ingest_documents(document_chunks, filename: str):
    # Explicitly set the model so it matches the DIMENSION=4096
    embeddings = NVIDIAEmbeddings(
        model="nvidia/nv-embed-v1", 
        api_key=NVIDIA_API_KEY
    )

    # Clean namespace name
    namespace = filename.replace("/", "_").replace(".", "_").replace(":", "").lower()
    
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # 1. Fix/Create DB
    ensure_index_exists(pc)

    index = pc.Index(INDEX_NAME)

    # 2. Check if data already exists in this namespace
    stats = index.describe_index_stats()
    if namespace in stats.get("namespaces", {}):
        count = stats["namespaces"][namespace]["vector_count"]
        print(f"⚠️  Namespace '{namespace}' already has {count} vectors.")
        # Optional: Delete old data if you want to overwrite
        # print("   Overwriting...")
        # index.delete(delete_all=True, namespace=namespace)
        print("   Skipping ingestion (Remove this check if you want to overwrite).")
        return

    print(f"🚀 Starting ingestion for namespace: {namespace}")

    vectorstore = PineconeVectorStore(
        index=index,
        embedding=embeddings,
        namespace=namespace
    )

    ingest_in_batches(document_chunks, vectorstore)

    print(f"🎉 All documents ingested into namespace: {namespace}")


# ================= MAIN =================
def main():
    # Update this path if needed
    pdf_path = "B:/Protfilo/my-protfilo/src/assets/kiran_bio.pdf"

    print("--> Processing File...")
    chunks = file_process(pdf_path)
    print(f"--> Found {len(chunks)} chunks.")
    
    ingest_documents(chunks, pdf_path)

if __name__ == "__main__":
    main()


    