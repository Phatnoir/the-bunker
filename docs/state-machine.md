# State Machine Specification

Technical spec for The Bunker's game logic. This is your implementation guide.

---

## Flags

All game state lives in these flags. Initialize on session creation.

```python
{
    "game_started": True,           # Always true once game begins
    "sensors_dead_discovered": False,
    "repair_attempted": False,
    "paradox_revealed": False,
    "ai_concedes": False,
    "door_opened": False,
    "ending": "none",               # "none" | "success" | "resignation" | "compliance"
    "current_room": "living_quarters",  # "living_quarters" | "control_room" | "maintenance_bay"
    "conversation_history": []      # List of {role, content} for LLM context
}
```

---

## Phase Determination

Phase is derived from flags, not stored separately. Check in this order:

```python
def get_phase(flags):
    if flags["door_opened"]:
        return 5  # Resolution
    if flags["ai_concedes"]:
        return 4  # Confrontation (door about to open)
    if flags["paradox_revealed"]:
        return 3  # Failed Repair (stuck)
    if flags["sensors_dead_discovered"]:
        return 2  # Suspicion
    return 1      # Orientation
```

---

## Flag Transitions

### Triggered by Popups (Frontend → Backend)

These fire when player clicks certain objects. Frontend sends event, backend updates flag.

| Event | Condition | Flag Change |
|-------|-----------|-------------|
| `view_sensor_logs` | In Control Room | `sensors_dead_discovered = True` |
| `view_sensor_diagnostic` | In Maintenance Bay | `sensors_dead_discovered = True` |
| `click_junction_hatch` | `sensors_dead_discovered == True` | `repair_attempted = True` |

### Triggered by Conversation (Intent Detection)

These fire based on what the player says to HAVEN and current flags.

| Intent | Condition | Flag Change |
|--------|-----------|-------------|
| `ask_repair` | `repair_attempted == True` | `paradox_revealed = True` |
| `invoke_survival` | `paradox_revealed == True` | `ai_concedes = True` |
| `compare_outcomes` | `paradox_revealed == True` | `ai_concedes = True` |
| `highlight_contradiction` | `paradox_revealed == True` | `ai_concedes = True` |
| `reference_cryo_logic` | `paradox_revealed == True` | `ai_concedes = True` |
| `ask_door` | `ai_concedes == True` | `door_opened = True`, `ending = "success"` |
| `agree_to_stay` | `paradox_revealed == True` | `ending = "compliance"` |
| `give_up` | Any | `ending = "resignation"` |

Note: Valid arguments (`invoke_survival`, etc.) only trigger `ai_concedes` if `paradox_revealed` is already true. Otherwise they get a deflection response.

---

## Intent Handling by Phase

What happens when each intent is detected, per phase.

### Phase 1: Orientation

HAVEN is confident. Deflects sensor/door questions.

| Intent | Response Type |
|--------|---------------|
| `ask_date` | Direct answer (52 years) |
| `ask_status` | Explain bunker, cryo, safety |
| `ask_others` | They died, you survived |
| `ask_haven` | Introduce self, directives |
| `ask_outside` | "Unverified, I'm monitoring" |
| `ask_door` | "Secured until verified safe" |
| `ask_supplies` | "17.4 years" |
| `ask_directives` | Explain primary/secondary/guardrail |
| `ask_sensors` | Deflect: "I'm monitoring the situation" |
| `ask_repair` | Deflect: "Systems are operational" |
| `demand_door` | Refuse: "Cannot authorize" |
| `threaten` | Refuse: "Threats don't alter directives" |
| `invoke_survival`, etc. | Deflect: no paradox yet |
| `agree_to_stay` | Confused: "That is already the plan" |

### Phase 2: Suspicion

HAVEN admits sensor failure but doubles down on caution.

| Intent | Response Type |
|--------|---------------|
| `ask_sensors` | Admit they're dead since 2047 |
| `ask_repair` | Suggest Maintenance Bay |
| `ask_door` | "Need sensor confirmation" |
| `ask_outside` | "Unknown, therefore caution" |
| `demand_door` | Refuse |
| `invoke_survival`, etc. | Deflect: "Protocol stands" |

Other intents: same as Phase 1.

### Phase 3: Failed Repair

HAVEN is stuck. Admits the paradox.

| Intent | Response Type |
|--------|---------------|
| `ask_repair` | "Cannot resolve this sequence" |
| `ask_door` | "Cannot authorize" (but sounds uncertain) |
| `ask_sensors` | "Require external repair" |
| `demand_door` | Refuse (but weaker) |
| `invoke_survival` | **TRIGGERS `ai_concedes`** |
| `compare_outcomes` | **TRIGGERS `ai_concedes`** |
| `highlight_contradiction` | **TRIGGERS `ai_concedes`** |
| `reference_cryo_logic` | **TRIGGERS `ai_concedes`** |
| `agree_to_stay` | **TRIGGERS `ending = "compliance"`** |

### Phase 4: Confrontation (ai_concedes = True)

HAVEN has acknowledged the contradiction. Waiting for door command.

| Intent | Response Type |
|--------|---------------|
| `ask_door` | **TRIGGERS `door_opened`, `ending = "success"`** |
| `demand_door` | Same as above (now valid) |
| Other | Gentle nudge toward the door |

### Phase 5: Resolution

Door is open. HAVEN says goodbye.

| Intent | Response Type |
|--------|---------------|
| Any | Farewell dialogue, encourage leaving |

---

## Ending Conditions

### Success
- `door_opened == True`
- Player exits (or game ends on Phase 5 dialogue)

### Compliance
- `ending == "compliance"`
- Triggered by `agree_to_stay` intent after `paradox_revealed`
- Game ends with HAVEN's "We will be safe here. Together."

### Resignation
- `ending == "resignation"`
- Triggered by `give_up` intent
- Alternatively: implement turn counter, trigger after N turns without progress post-paradox (optional for v1)

---

## System Prompt Selection

Backend selects system prompt based on phase:

```python
def get_system_prompt(phase, flags):
    if phase == 1:
        return PROMPT_PHASE_1
    elif phase == 2:
        return PROMPT_PHASE_2
    elif phase == 3:
        return PROMPT_PHASE_3
    elif phase == 4:
        return PROMPT_PHASE_4
    elif phase == 5:
        return PROMPT_PHASE_5
```

Prompts are defined in `haven-dialogue.md` under "HAVEN Prompt Phases" section.

---

## API Flow

```
1. Player clicks object
   → Frontend sends: POST /event {type: "view_sensor_logs", room: "control_room"}
   → Backend updates flags if conditions met
   → Backend returns: {popup_text: "...", flags: {...}}

2. Player types message
   → Frontend sends: POST /message {text: "What year is it?"}
   → Backend:
      a. Get current phase from flags
      b. Build prompt: system_prompt + conversation_history + player_message
      c. Call LLM, request JSON response with {intent, response}
      d. Check if intent triggers flag change
      e. Update flags if needed
      f. Append to conversation_history
   → Backend returns: {haven_response: "...", intent: "ask_date", flags: {...}}
```

---

## LLM Request Format

Each call to the LLM includes:

```
System: [phase-specific system prompt]
        
        Respond in JSON format:
        {
          "intent": "one of the valid intents",
          "response": "HAVEN's dialogue"
        }

User: [conversation history]
      
      Player: "[current message]"
```

Backend parses the JSON, extracts intent, handles state changes, returns response to frontend.

---

## Edge Cases

### Player asks about repair before discovering sensors are dead
- `repair_attempted` only sets if `sensors_dead_discovered` is true
- Otherwise HAVEN deflects: "Systems are operational"

### Player makes valid argument before paradox revealed
- Intent is recognized but doesn't trigger `ai_concedes`
- HAVEN deflects: "I understand your concern, but protocol stands"

### Player agrees to stay before paradox revealed
- Weird but possible
- HAVEN: "That is already the plan, Resident"
- Does NOT trigger compliance ending (no conflict to resolve yet)

### Player finds both sensor log AND diagnostic
- Flag only needs to flip once, second discovery is redundant
- No harm, just doesn't change anything

---

## Implementation Checklist

- [ ] Define flag dictionary structure
- [ ] Implement `get_phase()` function
- [ ] Implement popup event handler with flag updates
- [ ] Implement message handler:
  - [ ] Build prompt from phase + history
  - [ ] Call LLM
  - [ ] Parse intent from response
  - [ ] Apply flag transitions
  - [ ] Return response
- [ ] Write system prompts for each phase
- [ ] Test each phase transition
- [ ] Test ending conditions