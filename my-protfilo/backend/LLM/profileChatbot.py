from fastapi import status, HTTPException, APIRouter
from pydantic import BaseModel
from backend.IntentLLM.profileLLM import predict_intent
from backend.LLM.jsonResponce import responceJson
from backend.LLM.chatNVD import build_portfolio_chatbot
import random
import traceback

router = APIRouter(prefix='/protfiloChatbot', tags=['Chatbot'])

class ChatRequest(BaseModel):
    userName: str
    question: str

@router.post('/profilechatbotResponce')
async def aiResponce(request: ChatRequest):
    try:
        print(f"Received - User: {request.userName}, Question: {request.question}")
        
        # predict_intent returns a dict: {"intent": "greeting", "conf": 0.95}
        result = predict_intent(request.question)
        intent = result["intent"]
        conf = result["conf"]
        
        print(f" Intent: {intent}, Confidence: {conf}")

        if conf > 0.8:
            randnum = random.randint(0, 9)
            # responceJson is a FUNCTION, not a dict
            response_text = responceJson(intent, randnum)
            print(f" Using predefined response: {response_text}")
            return {"response": response_text}
        
        print(f" Using chatbot for low confidence ({conf})")
        chat_stream = build_portfolio_chatbot(username=request.userName)
        
        # Check if chat_stream returns awaitable
        if hasattr(chat_stream, '__call__'):
            try:
                responce = await chat_stream(request.question)
            except TypeError:
                responce = chat_stream(request.question)
        else:
            responce = str(chat_stream)
        
        print(f" Chatbot response: {responce}")
        
        # Handle different response types
        if isinstance(responce, str):
            return {"response": responce}
        elif isinstance(responce, dict):
            return responce if "response" in responce else {"response": str(responce)}
        else:
            return {"response": str(responce)}
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")