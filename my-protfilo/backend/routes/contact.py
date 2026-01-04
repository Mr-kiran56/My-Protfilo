from backend.Database import get_db
from backend import models
from fastapi import status,HTTPException,Depends,APIRouter,Request
from sqlalchemy.orm import Session
from backend import schema

router=APIRouter(
    tags=['Contact'],
    prefix="/contact"
)

@router.post('/',status_code=status.HTTP_201_CREATED)
def Contact_Post(request:schema.ContactDetail,db:Session=Depends(get_db)):
    contact_request=models.CONTACT(first_name=request.firstname,second_name=request.secondname,email=request.email,subject=request.subject,message=request.message)

    db.add(contact_request)
    db.commit()
    db.refresh(contact_request)
    if not contact_request:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="contact information is not acceptable something is wrong!!"
        )
    return contact_request





