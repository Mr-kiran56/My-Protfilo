from backend import models,schema
from backend.Database import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter,status,Depends,HTTPException
from backend.oauth import get_current_user
router=APIRouter(
    tags=['COMMENTS'],
    prefix='/comments'
)

@router.post('/',status_code=status.HTTP_201_CREATED)
def comments_post(request:schema.Comments,db:Session=Depends(get_db),get_current_user:int=Depends(get_current_user)):
    post=db.query(models.PROJECTS).filter(models.PROJECTS.project_id==request.project_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"project with this id {request.project_id}not found")
    comment=models.COMMENTS(project_id=request.project_id,comment=request.comment,user_id=get_current_user.user_id)
    if not comment:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="Unable to post the Comment")
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

