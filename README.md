# **The Bunker**

*A small, LLM-driven, point-and-click-style text adventure about waking up in a nuclear bunker… and arguing with an AI that refuses to let you leave.*

You wake to flickering lights and a cold cryopod. **HAVEN**, the bunker AI, has decided the outside world is too dangerous — permanently. The entire game revolves around exploration, reading environmental clues, and trying to reason your way to freedom.

---

## **Features**

* **Backend:** FastAPI + OpenAI (GPT-4o-mini), deterministic state machine, JSON protocol.
* **Frontend:** Vanilla HTML/CSS/JS with Myst-style room images and hotspot navigation.
* **Design:** Multiple endings based on flags and “phases” (compliance → resignation → escape).
* **Debug Keys:**

  * **`~` / backtick** — shows current game phase + active flags
  * **`\`** — shows all valid clickable hotspots

---

## **Live Demo**

```
https://the-bunker.onrender.com/
```

Open it in any modern desktop browser and begin typing to speak with HAVEN.

---

## **Why I Built It**

I wanted something small but complete—something showing:

* I can **design, build, and ship** a full interactive experience.
* I can use **FastAPI + OpenAI** sanely, with guardrails instead of LLM chaos.
* I understand **stateful systems**, controlled narratives, and user-driven progression.

This also doubles as a portfolio piece for backend engineering, scripting, game logic design, and practical LLM integration.

---

## **Project Structure**

```
the-bunker/
├── backend/
│   ├── main.py          # FastAPI routes & static file serving
│   ├── game_logic.py    # State machine, flags, phases, endings
│   ├── prompts.py       # HAVEN system prompts
│   ├── static/
│   │   ├── index.html   # Game UI
│   │   ├── style.css
│   │   ├── game.js
│   │   ├── hotspots.js
│   │   └── img/
└── docs/                # Design notes & supporting documents
```

---

## **Running Locally**

1. **Clone:**

   ```bash
   git clone https://github.com/Phatnoir/the-bunker.git
   cd the-bunker/backend
   ```

2. **(Optional) Virtual environment:**

   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS / Linux:
   # source venv/bin/activate
   ```

3. **Install deps:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Add `.env`:**

   ```
   OPENAI_API_KEY=your-api-key
   ```

5. **Run:**

   ```bash
   uvicorn main:app --reload
   ```

Game: [http://localhost:8000/](http://localhost:8000/)

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## **Deployment (Render)**

* **Root directory:** `backend`
* **Build:**

  ```bash
  pip install -r requirements.txt
  ```
* **Start:**

  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```
* **Env vars:**

  * `OPENAI_API_KEY`

When deployed, the game lives at:

```
https://<your-service-name>.onrender.com/
```

---

## **Skills Demonstrated**

**Backend & API Design**

* Clean separation of HTTP, game logic, and LLM prompting
* JSON-structured responses with schema enforcement
* Controlled LLM behavior via “intent” classification + deterministic state updates

**Frontend**

* Image-mapped rooms with hotspots
* Popup overlays, keyboard communication, debug tooling
* No frameworks — lightweight and self-contained

**Narrative Design**

* A branching micro-story with thematic consistency
* Mechanical tension between “safety” and “freedom”
* LLM used as character voice, not as game logic

---

## **License**

### **Code**

Licensed under the **MIT License**.
(Full text in the `LICENSE` file.)

### **Narrative & Art**

All writing, dialogue, and images are under:

**Creative Commons BY-NC-SA 4.0**
You may share and adapt the narrative/art **non-commercially** with attribution and the same license.

---

## **Contact**

* Email: **[and_it_went@yahoo.com](mailto:and_it_went@yahoo.com)**
* GitHub: [https://github.com/Phatnoir](https://github.com/Phatnoir)

If you’d like a deeper walkthrough of the architecture or narrative system, I’m happy to provide it. Résumé upon request. 
