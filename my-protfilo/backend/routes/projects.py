from backend import models,schema
from backend.Database import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter,status,Depends,HTTPException
from typing import Optional,List
router=APIRouter(
    tags=['PROJECTS'],
    prefix='/projects'
)


@router.post('/')
def create_post(request:schema.ProjectsDetail,db:Session=Depends(get_db)):
    new_post=models.PROJECTS(ProjectName=request.ProjectName,ProjectContent=request.ProjectContent,TechStcak=request.TechStcak,GitHubLink=request.GitHubLink,PreviewLink=request.PreviewLink,ImageUrl=request.ImageUrl)
    if not new_post:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="Unable to Post")
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post



@router.get('/getallprojects', response_model=List[schema.ProjectShow])
def get_projects(db: Session = Depends(get_db)):
    posts = db.query(models.PROJECTS).all()

    if not posts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No projects found"
        )

    return posts

@router.get('/getprojects/{project_id}',response_model=schema.ProjectShow)
def get_project(project_id:int,db:Session=Depends(get_db)):
    post=db.query(models.PROJECTS).filter(models.PROJECTS.project_id==project_id).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Post with id {id} was not Found")
    return post



