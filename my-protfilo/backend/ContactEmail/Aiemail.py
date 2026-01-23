from fastapi import FastAPI, Form, HTTPException
from email.message import EmailMessage
import smtplib
import ssl
# pip install fastapi uvicorn python-multipart sendgrid python-dotenv

app = FastAPI()

# EMAIL CONFIG (use your email)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "your_email@gmail.com"
SENDER_PASSWORD = "your_app_password"  # NOT normal Gmail password
RECEIVER_EMAIL = "your_email@gmail.com"

@app.post("/contact")
def send_contact_email(
    name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...)
):
    try:
        email_msg = EmailMessage()
        email_msg["From"] = SENDER_EMAIL
        email_msg["To"] = RECEIVER_EMAIL
        email_msg["Subject"] = f"Contact Form: {subject}"
        email_msg["Reply-To"] = email  # 🔥 IMPORTANT

        email_msg.set_content(
            f"""
New Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
            """
        )

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(email_msg)

        return {"success": True, "message": "Email sent successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
