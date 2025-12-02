"""
The Bunker - FastAPI Backend
A proof-of-concept game with LLM-driven AI character.
"""

import os
import json
import uuid
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

from game_logic import (
    create_new_game,
    get_phase,
    process_popup_event,
    process_intent,
    is_game_over,
    get_ending_type,
    ALL_INTENTS,
)
from prompts import get_system_prompt

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory session storage (use Redis or DB for production)
sessions: dict[str, dict] = {}


# --- Pydantic Models ---

class NewGameResponse(BaseModel):
    session_id: str
    message: str
    flags: dict


class PopupEventRequest(BaseModel):
    session_id: str
    event: str
    room: str


class PopupEventResponse(BaseModel):
    flags: dict
    phase: int


class MessageRequest(BaseModel):
    session_id: str
    text: str


class MessageResponse(BaseModel):
    haven_response: str
    intent: str
    flags: dict
    phase: int
    game_over: bool
    ending: Optional[str]


class GameStateResponse(BaseModel):
    flags: dict
    phase: int
    game_over: bool
    ending: Optional[str]
    conversation_history: list


# --- Lifespan ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("The Bunker backend starting...")
    if not os.getenv("OPENAI_API_KEY"):
        print("WARNING: OPENAI_API_KEY not set!")
    yield
    # Shutdown
    print("The Bunker backend shutting down...")


# --- App Setup ---

app = FastAPI(
    title="The Bunker",
    description="A proof-of-concept LLM-driven text adventure",
    lifespan=lifespan,
)

# CORS for frontend on different domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Helper Functions ---

def get_session(session_id: str) -> dict:
    """Get session or raise 404."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]


def call_llm(system_prompt: str, conversation_history: list, player_message: str) -> dict:
    """
    Call OpenAI API and parse response.
    Returns dict with 'intent' and 'response'.
    """
    messages = [
        {"role": "system", "content": system_prompt},
    ]
    
    # Add conversation history
    for entry in conversation_history[-10:]:  # Last 10 exchanges
        messages.append({"role": "user", "content": entry["player"]})
        messages.append({"role": "assistant", "content": entry["haven"]})
    
    # Add current message
    messages.append({"role": "user", "content": player_message})
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Cheap and fast, good for POC
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=500,
        )
        
        content = response.choices[0].message.content
        parsed = json.loads(content)
        
        # Validate intent
        intent = parsed.get("intent", "unknown")
        if intent not in ALL_INTENTS:
            intent = "unknown"
        
        return {
            "intent": intent,
            "response": parsed.get("response", "I... cannot process that request."),
        }
        
    except json.JSONDecodeError:
        return {
            "intent": "unknown",
            "response": "I am experiencing a processing error. Please rephrase.",
        }
    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "intent": "unknown", 
            "response": "Systems nominal. Please repeat your query, Resident.",
        }


# --- Routes ---

@app.get("/")
async def root():
    """Serve the game (or redirect to static)."""
    return {"message": "The Bunker API. POST /api/new_game to start."}


@app.post("/api/new_game", response_model=NewGameResponse)
async def new_game():
    """Create a new game session."""
    session_id = str(uuid.uuid4())
    sessions[session_id] = create_new_game()
    
    return NewGameResponse(
        session_id=session_id,
        message="Session created. HAVEN is online.",
        flags=sessions[session_id],
    )


@app.get("/api/state/{session_id}", response_model=GameStateResponse)
async def get_state(session_id: str):
    """Get current game state."""
    state = get_session(session_id)
    phase = get_phase(state)
    
    return GameStateResponse(
        flags=state,
        phase=phase.value,
        game_over=is_game_over(state),
        ending=get_ending_type(state),
        conversation_history=state["conversation_history"],
    )


@app.post("/api/event", response_model=PopupEventResponse)
async def handle_event(request: PopupEventRequest):
    """Handle a popup/click event from the frontend."""
    state = get_session(request.session_id)
    
    # Process the event
    updated_state = process_popup_event(state, request.event, request.room)
    sessions[request.session_id] = updated_state
    
    phase = get_phase(updated_state)
    
    return PopupEventResponse(
        flags=updated_state,
        phase=phase.value,
    )


@app.post("/api/message", response_model=MessageResponse)
async def handle_message(request: MessageRequest):
    """Handle a player message to HAVEN."""
    state = get_session(request.session_id)
    
    # Check if game is already over
    if is_game_over(state):
        ending = get_ending_type(state)
        return MessageResponse(
            haven_response="[The game has ended.]",
            intent="game_over",
            flags=state,
            phase=get_phase(state).value,
            game_over=True,
            ending=ending,
        )
    
    # Get current phase and system prompt
    phase = get_phase(state)
    system_prompt = get_system_prompt(phase.value, get_ending_type(state))
    
    # Call LLM
    llm_result = call_llm(
        system_prompt,
        state["conversation_history"],
        request.text,
    )
    
    intent = llm_result["intent"]
    haven_response = llm_result["response"]
    
    # Process intent and update flags
    updated_state = process_intent(state, intent)
    
    # Add to conversation history
    updated_state["conversation_history"].append({
        "player": request.text,
        "haven": haven_response,
        "intent": intent,
    })
    
    # Save updated state
    sessions[request.session_id] = updated_state
    
    # Get new phase (may have changed)
    new_phase = get_phase(updated_state)
    
    return MessageResponse(
        haven_response=haven_response,
        intent=intent,
        flags=updated_state,
        phase=new_phase.value,
        game_over=is_game_over(updated_state),
        ending=get_ending_type(updated_state),
    )


@app.post("/api/haven_greeting")
async def haven_greeting(session_id: str):
    """Get HAVEN's opening greeting (called on game start)."""
    state = get_session(session_id)
    
    greeting = (
        "Good morning, Resident. I am HAVEN. "
        "Please remain still while your motor functions recalibrate.\n\n"
        "You have been in cryopreservation for an extended period. "
        "Disorientation is expected. I am here to assist your transition to active status.\n\n"
        "The facility is secure. Supplies are adequate. You are safe."
    )
    
    # Add to history
    state["conversation_history"].append({
        "player": "[SYSTEM: Resident awakens]",
        "haven": greeting,
        "intent": "greeting",
    })
    sessions[session_id] = state
    
    return {"haven_response": greeting}


# --- Static Files (for single-server deployment) ---
# Uncomment these when you have a static/ folder with frontend

# app.mount("/static", StaticFiles(directory="static"), name="static")

# @app.get("/game")
# async def serve_game():
#     return FileResponse("static/index.html")


# --- Run with: uvicorn main:app --reload ---

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)