from fastapi import FastAPI
from backend.Database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import contact,projects,comments,login,profie_upvote,project_upvote
from backend.LLM import profileChatbot
app = FastAPI()

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


