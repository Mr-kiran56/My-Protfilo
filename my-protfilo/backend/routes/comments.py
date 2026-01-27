# backend/routers/comments.py (or add to your existing routes file)

from backend import models, schema
from fastapi import status, Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session, joinedload
from backend.Database import get_db
from backend.oauth import get_current_user
from typing import List

router = APIRouter(
    tags=['COMMENTS'],
    prefix='/comments'
)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_comment(
    request: schema.Comments, 
    db: Session = Depends(get_db),
    current_user: models.CREATEUSER = Depends(get_current_user)
):
    user_id = current_user.user_id
    project = db.query(models.PROJECTS).filter(
        models.PROJECTS.project_id == request.project_id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {request.project_id} doesn't exist"
        )
    new_comment = models.COMMENTS(
        project_id=request.project_id,
        user_id=user_id,
        comment=request.comment
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return {
        "message": "Comment posted successfully",
        "comment_id": new_comment.id
    }



@router.get('/project/{project_id}', response_model=List[schema.CommentOut])
def get_project_comments(project_id: int, db: Session = Depends(get_db)):

    comments = (
        db.query(models.COMMENTS)
        .options(joinedload(models.COMMENTS.comments_user))
        .filter(models.COMMENTS.project_id == project_id)
        .all()
    )
    
    return comments




@router.delete('/{comment_id}')
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.CREATEUSER = Depends(get_current_user)
):
    user_id = current_user.user_id
    
    comment = db.query(models.COMMENTS).filter(
        models.COMMENTS.id == comment_id
    ).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Comment not found"
        )
    
    if comment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    db.delete(comment)
    db.commit()
    
    return {"message": "Comment deleted successfully"}