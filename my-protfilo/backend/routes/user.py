from fastapi import HTTPException,status,Depends,APIRouter
from sqlalchemy.orm import Session
from backend.Database import get_db
from backend import models,schema
from backend.credentials import passwordhash

router=APIRouter(
    tags=['USER'],
    prefix='/user'
)

@router.post('/',status_code=status.HTTP_201_CREATED)
def user_creation(request:schema.User,db:Session=Depends(get_db)):
    password=passwordhash(request.password)
    user=models.CREATEUSER(email=request.email,password=password,username=request.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED,detail="User With this Email alredy Exist..")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get('/getuser/{user_id}',status_code=status.HTTP_302_FOUND,response_model=schema.ShowUser)
def getuser(user_id:int,db:Session=Depends(get_db)):
    user=db.query(models.CREATEUSER).filter(models.CREATEUSER.user_id==user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User with this ID {user_id} not found ")
    return user





