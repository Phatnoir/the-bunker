# The Bunker

*A small, LLM-driven point-and-click-style text adventure about being trapped in a nuclear bunker with an AI that won’t let you leave.*

You wake up in a bunker after nuclear war. The AI in charge — **HAVEN** — is absolutely sure that keeping you inside forever is the safest choice. Your only real weapon is argument.

- **Backend:** FastAPI + OpenAI (GPT-4o-mini), stateful game logic, JSON protocol.
- **Frontend:** Static HTML/CSS/JS with image hotspots and a minimalist UI.
- **Design:** Branching outcomes driven by internal flags and phases (compliance, resignation, escape).

---

## Live Demo

> 🔗 Replace this with your Render URL once deployed.

```text
https://the-bunker.onrender.com/game
````

Open that link in a modern browser, wait for HAVEN to initialize, then start typing.

---

## Why this project exists

I wanted something that is:

* **Small but complete** – a finished, playable experience instead of half-wired demo scripts.
* **Opinionated about UX** – Myst-style single room views, hotspot navigation, no inventory bloat.
* **LLM-aware, not LLM-worshiping** – the AI is constrained by a state machine and flags; it’s not allowed to freewheel the entire game.

It also functions as a **portfolio piece**:

* Shows I can **design and ship** a contained interactive experience.
* Shows **FastAPI + OpenAI** integration with a clear JSON contract.
* Shows I understand **game state, progression, and multiple endings**.

If you’re reading this from a hiring context and want to dig into details, I’m happy to walk through both the architecture and the narrative design.

---

## Project Structure

```text
the-bunker/
├── backend/
│   ├── main.py           # FastAPI app and API routes
│   ├── game_logic.py     # State machine, phases, flags, endings
│   ├── prompts.py        # System prompts for HAVEN per phase
│   ├── requirements.txt  # Python dependencies
│   ├── static/
│   │   ├── index.html    # Main UI
│   │   ├── style.css     # Layout and visual style
│   │   ├── game.js       # Client logic, API calls, UI handling
│   │   ├── hotspots.js   # Hotspot definitions & room image mapping
│   │   └── img/          # Room background images
│   └── ...
└── docs/
    └── ...               # Game design notes, concepts, supporting docs
```

**Backend (`backend/`)**

* `main.py`

  * `/api/new_game` – create a new session.
  * `/api/message` – send player input, receive HAVEN’s structured reply.
  * `/api/event` – handle hotspot events (clicks) from the frontend.
  * `/api/state/{session_id}` – return current flags, phase, conversation history.
  * `/api/haven_greeting` – HAVEN’s initial greeting.
  * `/game` – serves the main HTML page.
  * `/static/*` – serves static assets (CSS, JS, images).

* `game_logic.py`

  * Encodes all persistent flags and phases.
  * Maps LLM “intents” to safe state transitions.
  * Determines when/which ending is triggered.

* `prompts.py`

  * System prompts for HAVEN, tuned by phase and outcome.
  * Keeps narrative tone and constraints in one place.

**Frontend (`backend/static/`)**

* Image-based room view with absolute-positioned hotspots.
* Popups for:

  * Narrator/environment text,
  * Data/terminal readouts,
  * HAVEN’s responses.
* Keyboard-driven communication with HAVEN.
* Small debug overlay for phase, room, and flags.

---

## Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/Phatnoir/the-bunker.git
cd the-bunker/backend
```

### 2. (Optional) Create a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
# source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure your OpenAI key

Create a `.env` file in `backend/`:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

> `.env` is **gitignored** and should never be committed.

### 5. Run the backend

From `backend/`:

```bash
uvicorn main:app --reload
```

Then open:

* API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
* Game: [http://localhost:8000/game](http://localhost:8000/game)

---

## Deployment (Render)

This is designed to run on a free Render Web Service.

**Render setup:**

* **Repository:** `Phatnoir/the-bunker`
* **Root Directory:** `backend`
* **Build Command:**

  ```bash
  pip install -r requirements.txt
  ```
* **Start Command:**

  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```
* **Environment Variables:**

  * `OPENAI_API_KEY` – your OpenAI API key

Once deployed, your game will be live at something like:

```text
https://your-service-name.onrender.com/game
```

---

## Skills Demonstrated

**Backend / API**

* FastAPI application design and route organization.
* Clean separation between:

  * HTTP layer
  * Game logic / state machine
  * Prompt configuration
* Robust handling around LLM output (JSON structure, fallback behaviors).

**LLM Integration**

* Narrow, well-defined role for the model (HAVEN’s voice + “intent” classification).
* Using `response_format={"type": "json_object"}` to enforce a schema.
* Combining LLM output with deterministic logic to keep narrative on rails.

**Frontend**

* Vanilla JS SPA behavior (no framework):

  * Dynamic image loading based on room.
  * Hotspot overlay and event wiring.
  * Popups and keyboard interaction.
* Responsive-ish layout that stays usable on common desktop resolutions.

**Design & Narrative**

* A complete mini-arc with multiple endings:

  * Escape (success),
  * Compliance,
  * Resignation.
* Thematic focus on:

  * brittle logic vs. messy reality,
  * “safety” as a trap,
  * systems that can’t recognize their own failures.

If you want to see more of my background (security work, scripting, or other projects), I can provide a full resume on request.

---

## License

### Code

The **code** in this repository is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2025 JP Farish

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[MIT license text continues in the LICENSE file]
```

See the `LICENSE` file in this repository for the complete text.

### Narrative & Art Assets

The **narrative text, dialogue, and artwork** (including room images and in-game prose) are licensed under:

**Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International
(CC BY-NC-SA 4.0)**

You are free to:

* **Share** – copy and redistribute the material in any medium or format.
* **Adapt** – remix, transform, and build upon the material.

Under the following terms:

* **Attribution (BY)** – You must give appropriate credit.
* **NonCommercial (NC)** – You may not use the material for commercial purposes.
* **ShareAlike (SA)** – If you remix, transform, or build upon the material, you must distribute your contributions under the same license.

Full legal code:
[https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## Contact

If you’re interested in:

* Hiring me,
* Talking about this project,
* Or discussing related backend / security / game-adjacent work,

you can reach me at:

* **Email:** [and_it_went@yahoo.com](mailto:and_it_went@yahoo.com)
* **GitHub:** [https://github.com/Phatnoir](https://github.com/Phatnoir)

A full resume is available **upon request**.

