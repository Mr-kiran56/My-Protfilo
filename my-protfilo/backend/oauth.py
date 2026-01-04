from jose import jwt,JWTError
from typing import Optional,List
from backend import models,schema
from datetime import datetime,timedelta
from fastapi.security import OAuth2PasswordBearer
from backend.Config import settings
from sqlalchemy.orm import Session
from fastapi import Depends,HTTPException,status
from backend.Database import get_db
outh2_scheme=OAuth2PasswordBearer(tokenUrl='/login')
SECRECT_KEY=settings.secret_key
ALGORITHM=settings.algoritm
EXPIRE_TIME=settings.expire_time

def create_access_token(data:dict):
    to_encode=data.copy()
    expiretime=datetime.utcnow()+timedelta(expiretime=EXPIRE_TIME)
    to_encode.update({"exp":expiretime})
    token=jwt.encode(to_encode,SECRECT_KEY,algorithm=ALGORITHM)
    return token

def verify_token(token:str,credential_exception):
    try:
        playload=jwt.decode(token,SECRECT_KEY,algorithms=[ALGORITHM])
        user_id :str=playload.get("user_id")
        if not user_id:
            raise credential_exception
        token_data=schema.TokenData(id=user_id)
    except JWTError:
        raise credential_exception
    return token_data

def get_current_user(token:str=Depends(outh2_scheme),db:Session=Depends(get_db)):
    credential_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="invalid Credentials",
        headers={"WWW-Authenticate": "Bearer"})
    token_data=verify_token(token,credential_exception)
    user=db.query(models.CREATEUSER).filter(models.CREATEUSER.user_id==token_data.id).first()
    if not user:
        raise credential_exception
    return user

    
