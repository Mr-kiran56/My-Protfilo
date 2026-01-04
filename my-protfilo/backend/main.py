from fastapi import FastAPI
from backend.Database import engine, Base
from backend.routes import contact,projects,comments,user
app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(contact.router)
app.include_router(projects.router)
app.include_router(comments.router)
app.include_router(user.router)
@app.get("/")
def load():
    return {"message": "hii there how are you !!!"}
