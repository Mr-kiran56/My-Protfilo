from sqlalchemy.orm import Session
from fastapi import status,Depends,HTTPException,APIRouter
from backend.Database import get_db
from backend.oauth import get_current_user
from backend import models,schema
from sqlalchemy import func

router=APIRouter(tags=['PROFILE_UPVOTE'],
                 prefix='/profile_upvote')

@router.post('/')
def profile_upvote(db:Session=Depends(get_db),get_current_user:int=Depends(get_current_user)):
    current_user_id=get_current_user.user_id
    user_exit=db.query(models.PROFILE_UPVOTE).filter(models.PROFILE_UPVOTE.user_id==current_user_id)
    if not user_exit:
        user_upvote=models.PROFILE_UPVOTE(user_id=current_user_id)
        db.add(user_upvote)
        db.commit()
        db.refresh(user_upvote)
        return {"Thanks for Up-Voting Me"}
    return {"Thanks You are Already Up-Voted"}




@router.get('/getall-upvotes')
def get_all_upvotes(db: Session = Depends(get_db),get_current_user:int=Depends(get_current_user)):

    total_upvotes = db.query(models.PROFILE_UPVOTE).count()
    return {
        "total_profile_upvotes": total_upvotes
    }
