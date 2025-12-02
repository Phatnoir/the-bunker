# The Bunker - Backend

A proof-of-concept LLM-driven text adventure game. Talk to HAVEN, a bunker AI that's keeping you trapped for your own safety.

## Quick Start (Local)

### 1. Install dependencies

```bash
# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install packages
pip install -r requirements.txt
```

### 2. Set up API key

```bash
# Copy the example env file
copy .env.example .env  # Windows
# cp .env.example .env  # Mac/Linux

# Edit .env and add your OpenAI API key
```

Get an API key at: https://platform.openai.com/api-keys

### 3. Run the server

```bash
uvicorn main:app --reload
```

Server runs at `http://localhost:8000`

### 4. Test it

```bash
# Create a new game
curl -X POST http://localhost:8000/api/new_game

# Send a message (replace SESSION_ID with the one you got)
curl -X POST http://localhost:8000/api/message \
  -H "Content-Type: application/json" \
  -d '{"session_id": "SESSION_ID", "text": "What year is it?"}'
```

Or visit `http://localhost:8000/docs` for the interactive API docs.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/new_game` | POST | Create new game session |
| `/api/state/{session_id}` | GET | Get current game state |
| `/api/event` | POST | Handle popup/click events |
| `/api/message` | POST | Send message to HAVEN |
| `/api/haven_greeting` | POST | Get HAVEN's opening greeting |

## Deploy to Render

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `OPENAI_API_KEY` = your key
7. Deploy

## Project Structure

```
backend/
├── main.py           # FastAPI app, routes
├── game_logic.py     # State machine, flags
├── prompts.py        # HAVEN system prompts
├── requirements.txt  # Dependencies
├── .env.example      # Template for API key
└── .gitignore        # Don't commit secrets
```

## Cost

OpenAI API costs ~$0.15-0.60 per million tokens. A full playthrough uses maybe 10-20k tokens. Expect to spend pennies during development.