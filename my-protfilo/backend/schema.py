from pydantic import BaseModel, EmailStr,conint
from datetime import datetime
from typing import Optional

class ContactDetail(BaseModel):
    firstname: str
    secondname: str
    email: EmailStr
    subject: str
    message: str
    datetime: datetime

class ProjectsDetail(BaseModel):
    ProjectName:str
    ProjectContent:str
    TechStcak:str
    GitHubLink:str
    PreviewLink:str
    ImageUrl:str

class ProjectShow(ProjectsDetail):
    project_id:int
    class Config:
        orm_mode=True

    
class Comments(BaseModel):
    project_id:int
    comment:str
    
class User(BaseModel):
    email:EmailStr
    password:str
    username:str

class ShowUser(User):
    user_id:int
    # created_at:datetime
    class Config:
        orm_mode=True

class TokenData(BaseModel):
    id: Optional[int] = None


class Token(BaseModel):
    access_token:str
    token_type:str
    
class ProjectUpvote(BaseModel):
    project_id:int
    dir:conint(le=1)