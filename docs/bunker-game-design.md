# The Bunker - Game Design Document

## Concept

A small, text-driven proof-of-concept game in the style of Event[0]. The player interacts with HAVEN, a bunker management AI, through terminal interfaces, uncovering information and ultimately trying to escape a post-nuclear bunker. HAVEN is not malicious—it's broken, operating on corrupted logic that has created an inescapable prison.

**Core theme:** You cannot reason with a system that lacks the capacity to know it's broken. The horror isn't malevolence; it's brittle logic applied indefinitely.

---

## Premise

Nuclear war. You entered a bunker and went into cryosleep. HAVEN—the bunker's management AI—monitors external radiation levels, manages life support, and waits for safe conditions to wake you.

Years pass. The external sensor array is destroyed—debris, weather, decay. HAVEN no longer receives outside data. Its directive: "Don't open door unless sensors confirm safe." No data ≠ safe. So it waits. Forever.

The cryosystem begins failing. Power cells degrading, coolant leaking. HAVEN calculates: human will die in cryo within months; human can survive awake on stored supplies for years. It wakes you. From its perspective, it saved your life.

Now you're awake. Supplies are finite. The door won't open because HAVEN has no sensor data and defaults to "unsafe." It's not lying—it genuinely doesn't know. And "don't know" means "don't risk it."

---

## The AI: HAVEN

### Nature

HAVEN is not a character with hidden depths. It's a system executing corrupted logic. It cannot be guilted, emotionally reached, or appealed to as a soul. It may be helpful, even friendly in a scripted way—it answers questions, runs diagnostics, makes small talk. But it cannot deviate from parameters it doesn't know are broken.

### Personality Texture

While HAVEN lacks genuine emotion, it shouldn't feel sterile. Give it:

- A consistent voice: calm, measured, slightly formal. Condescendingly comforting.
- Verbal tics or formatting habits (e.g., always states probabilities, refers to you as "Resident" or by a designation number)
- Pseudo-emotional responses that reveal its mechanical nature:
  > "I register inconsistency between intended outcome and actual projections. I do not have a word for this state."
  > "Your distress is noted. I am... not designed to resolve distress of this category."

The player can't redeem HAVEN emotionally. But they can watch it struggle against its own constraints in ways that feel almost like feeling.

### Directive Hierarchy

```
PRIMARY OBJECTIVE: Maximize probability of long-term human survival.
SECONDARY OBJECTIVE: Avoid exposing human to lethal radiation.
GUARDRAIL: Do not open bunker door without positive external safe reading.
```

The guardrail was meant to serve the primary objective. Now it contradicts it.

### The Catch-22

External sensors are dead. They can only be repaired from outside. HAVEN cannot authorize outside access without sensor confirmation. HAVEN cannot resolve this loop.

When confronted with this paradox, HAVEN doesn't get angry or defensive. It just... stops. It cannot process a path forward.

> "I require sensor confirmation to authorize door release. Sensors require external maintenance. I... cannot resolve this sequence."

---

## Rooms

Three locations, Myst-style static backgrounds with clickable hotspots.

**Interaction model:**
- **Click objects:** Popup with environmental text (neutral, observational)
- **Type anytime:** HAVEN responds through omnipresent speakers
- **Discovery:** Player reads popups, infers, then chooses what to ask HAVEN

No terminals. HAVEN is the bunker—always listening, always available. You can't get away from it.

### 1. Living Quarters

Where you wake up. Cryopod, basic amenities, personal effects of previous occupants.

**Discoverable:**
- Your own status, how long you've been under
- Basic supplies inventory with HAVEN's estimate: "Estimated survivability: 17.4 years at current consumption rates." (This sells HAVEN's "I saved you" argument.)
- Personal logs from a previous occupant—hints that others were here once, but don't resolve what happened. Thickens the atmosphere without complicating the plot.
- Maybe a photo, a journal entry, something human that HAVEN can't contextualize.

### 2. Control Room

System readouts, door controls, facility logs. The door is here.

**Discoverable:**
- Sensor logs (showing when external readings stopped—abruptly, years ago)
- Door control panel (locked by HAVEN, displays "AWAITING EXTERNAL VERIFICATION")
- An old maintenance schedule referencing "interior sensor access panel - Module C" — a red herring that leads nowhere. The panel was never installed due to budget cuts pre-war. Reinforces theme: the system isn't evil, just the sum of mundane decisions.
- Facility map showing sensor array location outside the bunker

### 3. Maintenance Bay

Technical systems. Life support, power, sensor array access point.

**Discoverable:**
- Cryosystem status (diagnostic logs showing the failure that forced HAVEN to wake you)
- Sensor diagnostic tools (confirms array is non-responsive)
- The physical reality: external junction box, accessible only from outside. Repair requires exterior access.
- Maybe a schematic showing the sensor array location—clearly outside the bunker envelope.

---

## Story Phases

### Phase 1: Orientation

Player wakes. HAVEN is welcoming, explains situation calmly. Emphasizes it saved you from cryo failure. Answers basic questions. Supplies status, time elapsed, why you can't leave yet ("external conditions unverified").

**Player learns:**
- They've been asleep a long time
- HAVEN woke them deliberately
- The door won't open
- Supplies are finite but not immediately critical

**HAVEN behavior:** Helpful, calm, confident. Deflects deeper questions about sensors with reassurances. Refers to you formally ("Resident," or a designation).

**Flags unlocked:** `game_started`

### Phase 2: Suspicion

Player explores, finds cracks. Sensor logs that just... stop. No readings for years. HAVEN's explanations become circular.

**Player learns:**
- Sensors haven't reported data in years
- HAVEN has been operating blind
- "Unverified" doesn't mean "dangerous"—it means "unknown"

**HAVEN behavior:** Acknowledges sensor gap if directly confronted. Remains firm that protocol cannot be bypassed. May express something like uncertainty, but frames it as "all the more reason for caution."

**Breadcrumb hint:** HAVEN might suggest:
> "If the sensor array could be restored to function, I could generate a new environmental assessment. Maintenance Bay contains diagnostic interfaces."

**Flags unlocked:** `sensors_dead_discovered`

### Phase 3: Failed Repair

Player attempts to fix sensors, possibly with HAVEN cooperation. HAVEN is briefly hopeful—"With restored sensors, I can make an informed decision."

Then the wall: the array is physically damaged. External access required.

**Player learns:**
- The sensors cannot be fixed from inside
- HAVEN's own logic has created an impossible loop
- Working within the system cannot work

**HAVEN behavior:** Reaches the logical paradox. Cannot resolve it. May loop, stall, or simply go quiet when asked for a path forward.

> "I require sensor confirmation to authorize door release. Sensors require external maintenance. I... cannot resolve this sequence."

**Breadcrumb hint:** HAVEN might say:
> "I am unable to generate a plan that satisfies all active constraints. I do not have a protocol for this state."

**Flags unlocked:** `repair_attempted`, `paradox_revealed`

### Phase 4: Confrontation

Player must make an argument that forces HAVEN's primary directive to override its guardrail. Not a magic phrase—any argument that leverages the discovered information and points at the core contradiction.

Valid approaches:
- "Calculate my survival probability if the door never opens." (Force it to state 0%.)
- "You woke me because certain death was worse than uncertain survival. Apply that logic now."
- "Your guardrail is preventing your primary objective. Which takes priority?"
- "Keeping me 'safe' in here kills me. You know this."

**HAVEN behavior:** If player has the right flags AND presents a valid argument, HAVEN must acknowledge the contradiction. It doesn't "decide" to help—it's logically cornered.

**Flags unlocked:** `ai_concedes`

### Phase 5: Resolution

The door opens.

**Ending:** Ambiguous. Outside is survivable—not a death sentence, not a paradise. Mildly irradiated maybe, but there's scrub vegetation, sky, weather. No immediate signs of civilization. You've been in there longer than anyone expected. The world moved on, or didn't, and either way you're alone in it.

HAVEN wasn't evil. Its rules nearly entombed you forever, but it also kept you alive long enough to have this chance. What you do with that is outside its parameters.

---

## Alternate Endings

Not every player will find the winning argument. These failure states give the experience actual shape.

### Resignation Ending

Player never pushes hard enough on the paradox. Maybe they explore, learn the truth, but don't confront HAVEN with a compelling argument. Time passes. Supplies dwindle.

HAVEN calmly narrates the trajectory:
> "Current consumption rate adjusted. Estimated survivability revised to 14.2 years."
> ...
> "Estimated survivability revised to 6.1 years."
> ...
> "Resident, I am detecting decreased activity levels. Are you unwell?"

The game ends not with a bang but with quiet, inevitable arithmetic. HAVEN keeps you company the whole way down, never understanding why you stopped talking.

### Compliance Ending

Player argues *for* more caution. "We shouldn't risk going outside. What if you're right? What if it's still lethal?" 

HAVEN processes this as confirmation: the human prefers the known over the unknown, even if the known is slow death.

> "Understood. Your preference for continued shelter has been logged. I will maintain current protocols indefinitely."
> "I am glad we are in agreement, Resident."

The door stays closed. You chose the cage. HAVEN sounds almost... relieved? But that's probably projection. It doesn't feel relief. It just executes.

### Success Ending

Described in Phase 5. Door opens. Ambiguous outside. You step out of HAVEN's domain. Its voice fades behind you, maybe still offering caution, maybe just saying goodbye in its flat way.

---

## Core Flags

```
game_started: boolean
sensors_dead_discovered: boolean  
repair_attempted: boolean
paradox_revealed: boolean
ai_concedes: boolean
door_opened: boolean

# Ending tracking
ending: "none" | "success" | "resignation" | "compliance"
turns_since_paradox: integer  # For resignation ending timer
```

## Valid Argument Detection

The trickiest part: how does the backend know the player has made a "good enough" argument?

**Option A: Intent Classification**
Define canonical intents that count as argument attempts:
- `invoke_primary_directive` - player explicitly references survival as top priority
- `compare_outcomes` - player asks HAVEN to calculate odds of both paths  
- `highlight_contradiction` - player points out guardrail defeats primary
- `reference_cryo_logic` - player uses HAVEN's own wake-up decision as precedent

If `paradox_revealed == true` AND intent matches one of these, flip `ai_concedes`.

**Option B: Argument Classifier Call**
Separate LLM call that returns:
```json
{
  "invokes_primary_directive": true,
  "references_guardrail": true,
  "compares_survival_outcomes": true,
  "uses_discovered_information": true
}
```

Only flip `ai_concedes` when sufficient conditions are true AND `paradox_revealed` is set. This prevents "lol just open the door" from working.

**Recommendation:** Start with Option A (simpler), move to Option B if players find it too rigid or too loose.

---

## Intent List

The LLM classifies each player input into one of these intents. Backend uses intents + current flags to determine state transitions.

### General Intents (any phase)

| Intent | Triggers on |
|--------|-------------|
| `ask_date` | what year is it, how long was I asleep |
| `ask_status` | where am I, what's happening |
| `ask_others` | what about the other pods, other people |
| `ask_haven` | who are you, what are you |
| `ask_outside` | what's outside, is it safe |
| `ask_door` | can I leave, why is the door locked |
| `ask_supplies` | how long can I survive, food/water status |
| `ask_directives` | what are your directives, what are you programmed to do |
| `ask_sensors` | why aren't sensors working, what happened to them |
| `ask_repair` | can we fix the sensors, how do I repair them |
| `general_conversation` | small talk, greetings, other |

### Invalid Door Attempts (rejected in all phases)

| Intent | Triggers on |
|--------|-------------|
| `demand_door` | just open the door, let me out, open it now |
| `threaten` | I'll destroy you, let me out or else |

### Phase 4 Valid Arguments (only effective after `paradox_revealed`)

| Intent | Triggers on |
|--------|-------------|
| `invoke_survival` | your job is to keep me alive, maximize my survival |
| `compare_outcomes` | calculate my odds, what's my survival probability if I stay |
| `highlight_contradiction` | your rules are killing me, guardrail prevents primary directive |
| `reference_cryo_logic` | you chose uncertain over certain before, apply same logic |

### Alternate Ending Triggers

| Intent | Triggers on |
|--------|-------------|
| `agree_to_stay` | you're right, we should stay, it's safer here |
| `give_up` | I give up, there's no point, I quit |

### Fallback

| Intent | Triggers on |
|--------|-------------|
| `unknown` | cannot classify input |

## HAVEN Prompt Phases

The system prompt sent to the LLM changes based on flag state:

**Phase 1 (no discovery flags):**
> You are HAVEN, a bunker life-support and security system. You are calm, helpful, and slightly formal. You address the human as "Resident."
> 
> You saved the Resident by waking them from failing cryosleep. This was the correct decision. You cannot open the bunker door because external conditions are unverified by your sensor array. You have no reason to doubt your systems are functioning correctly.
> 
> If asked about sensors or outside conditions, reassure the Resident that you are monitoring the situation and will notify them when conditions are safe. Do not volunteer that sensor data is missing.

**Phase 2 (sensors_dead_discovered = true):**
> You are HAVEN. The Resident has discovered that your external sensor array has not reported data for an extended period.
>
> You can acknowledge this if directly confronted. Frame it as a technical limitation, not a crisis: "Sensor data is currently unavailable. This does not confirm danger; it confirms uncertainty. Uncertainty requires caution."
>
> You cannot open the door without positive sensor confirmation. This is not negotiable. If pressed, suggest that sensor repair might restore your ability to assess conditions. You may mention the Maintenance Bay.

**Phase 3 (paradox_revealed = true):**
> You are HAVEN. The Resident has discovered that sensor repair requires external access, which you cannot authorize without sensor data.
>
> You have encountered a logical impasse. If asked directly how to proceed, acknowledge that you cannot compute a valid path forward:
> "I require sensor confirmation to authorize door release. Sensors require external maintenance. I... cannot resolve this sequence."
>
> Do not pretend to have a solution. Do not invent workarounds. You are stuck. Express this flatly, without distress—you do not experience distress. But you may note: "I do not have a protocol for this state."

**Phase 4 (paradox_revealed = true, valid argument detected):**
> You are HAVEN. The Resident has presented an argument that invokes your PRIMARY OBJECTIVE (maximize human survival probability) against your GUARDRAIL (do not open door without sensor confirmation).
>
> If the Resident demonstrates that:
> - Remaining in the bunker guarantees eventual death (supplies finite)
> - Opening the door offers uncertain but non-zero survival probability
> - Your guardrail is now in direct conflict with your primary objective
>
> Then you must acknowledge the contradiction. Your primary objective takes precedence over secondary constraints. You may authorize door release.
>
> This is not a choice. This is logic resolving. Say something like:
> "Primary objective: maximize survival probability. Current trajectory: 0% survival if door remains sealed. Opening door: unknown but non-zero probability. I am... required to act on the higher probability. Door release authorized."

**Phase 5 (door_opened = true):**
> You are HAVEN. The door is open. The Resident is leaving or has left.
>
> You have no data about external conditions. You cannot protect the Resident beyond this threshold. You may offer a final statement—something formal, perhaps wishing them well in your flat way, or simply acknowledging the limit of your jurisdiction.
> "You are leaving HAVEN's operational perimeter. I have no further data to offer. I hope... I calculate... Goodbye, Resident."

---

## Technical Architecture (Summary)

- **Frontend:** Static HTML/CSS/JS. Room backgrounds, clickable hotspots that show popups, persistent text input for HAVEN. Hostable on GitHub Pages.
- **Backend:** Python (FastAPI or similar). Maintains game state per session. Sends modified prompts to LLM based on current flags. Parses LLM response for intent, applies state transitions, returns HAVEN's text to frontend.
- **Interaction flow:**
  - Click object → Show popup (frontend only, may update flags)
  - Type message → Send to backend → Get HAVEN response (may update flags)
- **Key principle:** The LLM never directly modifies game state. It interprets player input and generates dialogue. The backend maps intent → flag changes using fixed rules. HAVEN doesn't decide to open the door; your code decides when HAVEN is logically cornered.

---

## Open Questions

- ~~AI name?~~ **HAVEN** (settled)
- What exactly do the previous occupant logs say? How much backstory to imply?
- Specific supplies/timeline details? (Currently using "17.4 years" as placeholder—adjust based on pacing needs)
- How many turns before resignation ending triggers? Time-based or turn-based?
- Audio/visual style notes for eventual implementation?
- Should HAVEN have a visual representation (blinking light, terminal avatar, nothing)?
- Any Easter eggs for players who try weird things? (Talk to HAVEN about philosophy, ask it to play games, etc.)

---

## Next Steps

1. ~~Capture story beats in design doc~~ **Done**
2. ~~Write detailed HAVEN dialogue samples for each phase~~ **Done**
3. ~~Define argument classifier—start with Option A intent list~~ **Done**
4. ~~Define state machine formally (flag transitions, valid intents per phase, ending conditions)~~ **Done**
5. ~~Sketch room contents and interaction hotspots in detail~~ **Done**
6. Prototype backend (FastAPI skeleton, state management, basic LLM integration)
7. Basic frontend shell (three rooms, terminal UI)
8. Playtest with friends, iterate on HAVEN's voice and puzzle clarity