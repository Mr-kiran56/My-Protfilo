from fastapi import FastAPI
from backend.Database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
# Ensure you are importing your routers correctly
from backend.routes import contact, projects, comments, login, profie_upvote, project_upvote
from backend.LLM import profileChatbot

from contextlib import asynccontextmanager
from backend.IntentLLM.profileLLM import load_intent_model, predict_intent
import os
from fastapi.responses import FileResponse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILE_PATH ="B:/Protfilo/my-protfilo/src/assets/Kiran_Punna_AIML_Resume.pdf"
# --- LIFESPAN MANAGER (WINDOWS SAFE VERSION) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Load the model when server starts
    print("\n" + "="*50)
    print("[STARTUP]: Attempting to load AI Models...")
    print(f"[DIR]: Current Working Directory: {os.getcwd()}")
    
    try:
        # Calls the function from profileLLM.py
        load_intent_model() 
        print("[SUCCESS]: AI Models loaded and ready!")
        print("="*50 + "\n")
        
    except Exception as e:
        print("\n" + "!"*50)
        print("[CRITICAL ERROR]: Model failed to load.")
        print(f"[ERROR DETAILS]: {e}")
        print("!"*50 + "\n")
        # We re-raise the error to stop the server
        raise e
    
    yield  # Server runs here
    
    # 2. Clean up when server stops
    print("[SHUTDOWN]: Clearing memory...")

# --- APP DEFINITION ---
app = FastAPI(lifespan=lifespan)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers
app.include_router(contact.router)
app.include_router(projects.router)
app.include_router(comments.router)
app.include_router(login.router)
app.include_router(profie_upvote.router)
app.include_router(project_upvote.router)
app.include_router(profileChatbot.router)

@app.get("/")
def load():
    return {"message": "hii there how are you !!!"}


@app.get("/download-word")
async def download_word():
    return FileResponse(
        path=FILE_PATH,
        media_type="application/pdf",
        filename="Kiran_Punna_AIML_Resume.pdf"
    )

