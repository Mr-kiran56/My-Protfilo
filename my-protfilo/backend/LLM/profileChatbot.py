from fastapi import status, HTTPException, APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import random
import traceback

# Ensure these imports match your actual file structure
from backend.IntentLLM.profileLLM import predict_intent
from backend.LLM.jsonResponce import responceJson
from backend.LLM.chatNVD import build_portfolio_chatbot

router = APIRouter(prefix='/protfiloChatbot', tags=['Chatbot'])

# --- FIX 1: Defined standard lowercase 'username' ---
class ChatRequest(BaseModel):
    username: str 
    question: str

@router.post('/profilechatbotResponce')
async def aiResponce(request: ChatRequest):
    try:
        # --- FIX 2: Updated print to use 'request.username' (not userName) ---
        print(f"Received - User: {request.username}, Question: {request.question}")
        
        # 1. INTENT DETECTION
        result = predict_intent(request.question)
        intent = result["intent"]
        conf = result["conf"]
        
        print(f" Intent: {intent}, Confidence: {conf}")

        # 2. IF HIGH CONFIDENCE -> RETURN JSON
        if conf > 0.90:
            randnum = random.randint(0, 9)
            response_text = responceJson(intent, randnum)
            print(f" Using predefined response: {response_text}")
            return JSONResponse(content={"response": response_text})
        
        # 3. IF LOW CONFIDENCE -> RETURN STREAM
        print(f" Using chatbot for low confidence ({conf})")
        
        # ... inside aiResponce ...
        
        # Initialize the chatbot 

        chat_stream_func = build_portfolio_chatbot(username=request.username)

        
        async def response_generator():
            try:
                # Add a "Start" debug message if needed
                # yield " " 
                async for chunk in chat_stream_func(request.question):
                    if chunk:
                        print(chunk)
                        yield chunk
            except Exception as e:
                print(f"Streaming Error: {e}")
                yield f"\n[System Error: {str(e)}]"

        return StreamingResponse(response_generator(), media_type="text/plain")
    
    
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")