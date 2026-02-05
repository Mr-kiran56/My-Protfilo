from backend.Database import get_db
from backend import models
from fastapi import status, HTTPException, Depends, APIRouter, Request
from sqlalchemy.orm import Session
from backend import schema
from datetime import datetime
import smtplib
from dotenv import load_dotenv
import os
from email.message import EmailMessage
load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))
router = APIRouter(prefix='/contact_email', tags=['Email_contact'])

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")
@router.post("/email")
def contact(request: schema.ContactDetail):
    # Create email message
    msg = EmailMessage()
    msg["Subject"] = f"New Contact Form: {request.subject}"
    msg["From"] = ADMIN_EMAIL
    msg["To"] = ADMIN_EMAIL
    msg["Reply-To"] = request.email  # So you can reply directly to the person
    
    # Create email body with all the person's information
    email_body = f"""
New Contact Form Submission

Name: {request.firstname} {request.secondname}
Email: {request.email}
Subject: {request.subject}

Message:
{request.message}

---
Received at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    """
    
    msg.set_content(email_body)
    
    try:
        # Send email
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(ADMIN_EMAIL, APP_PASSWORD)
            server.send_message(msg)
        
        return {"status": "success", "message": "Email sent successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )