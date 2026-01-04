from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends,status,HTTPException,APIRouter
from backend import models,schema
from sqlalchemy.orm import Session
from backend.Database import get_db
from backend.credentials import passworddehash
from backend.oauth import create_access_token
router=APIRouter(
    tags=['LOGIN'],
    prefix='/login'
)


@router.post('/',response_model=schema.Token)
def login(request:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    user=db.query(models.CREATEUSER).filter(models.CREATEUSER.email==request.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user with this email is not exist!!")
    if not passworddehash(request.password,user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Invalid Password!!")
    access_token=create_access_token({"user_id":user.user_id})

    return {"access_token":access_token,"token_type":"bearer"}