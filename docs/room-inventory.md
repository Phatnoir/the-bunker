# Room Inventory

Every interactable object in the bunker. Max 6 per room. One image per room.

---

## Interaction Model

- **Clicking objects:** Shows environmental popup text. Neutral, observational. No HAVEN voice here.
- **Typing:** Always available. Goes to HAVEN via speakers. HAVEN is omnipresent.
- **Discovery flow:** Player reads popup → infers something → chooses to ask HAVEN about it (or not).

---

## Navigation Model

Linear layout. Control Room is the hub.

```
Living Quarters ←→ Control Room ←→ Maintenance Bay
```

Exits are hotspots within each room image (doorways, corridors). Clicking them changes rooms. No map screen, no inventory.

---

## Critical Path Objects

Only 3 objects are required to complete the game:

1. **Sensor Log Display** (Control Room) — triggers `sensors_dead_discovered`
2. **Junction Box Hatch** (Maintenance Bay) — triggers `repair_attempted`, leads to paradox
3. **Door** (Control Room) — the goal

Everything else is flavor or context.

---

## Room 1: Living Quarters

Where you wake up. Personal space, survival basics, traces of the dead.

| Object | Type | Purpose |
|--------|------|---------|
| Your Cryopod | Flavor | Establishes admission date (2031) |
| Dead Cryopods | Flavor | Shows you're alone. One hotspot for all three. |
| Supply Cabinet | Flavor | World-building, can ask HAVEN for details |
| Personal Effects | Flavor | Humanizes a dead occupant |
| Speaker Grille | Flavor | Reminds player HAVEN is listening |
| Exit to Control Room | Navigation | Doorway/corridor |

### Object Details

**Your Cryopod**
- **Visual:** Open pod, frost residue, status display flickering
- **Popup:**
```
CRYOGENIC PRESERVATION UNIT - POD 3
STATUS: REVIVAL SEQUENCE COMPLETE

OCCUPANT: [REDACTED]
ADMISSION DATE: 09.14.2031
PRESERVATION STATUS: TERMINATED (SYSTEM FAULT)
```

**Dead Cryopods**
- **Visual:** Pods 1, 2, 4 visible. Dark displays. Frost on glass obscures interior.
- **Popup:**
*Three pods, dark displays, frost on glass. The readouts show:*
```
POD 1: OFFLINE - PRESERVATION FAILURE - 11.23.2039
POD 2: OFFLINE - PRESERVATION FAILURE - 03.17.2038
POD 4: OFFLINE - PRESERVATION FAILURE - 07.02.2041
```
*Shapes visible through the frost. You don't look too closely.*

**Supply Cabinet**
- **Visual:** Metal storage unit, sealed
- **Popup:** *Nutrient packs in neat rows. Water recycling containers. Basic medical supplies. Everything labeled and dated. Enough here for years.*

**Personal Effects**
- **Visual:** Small shelf near Pod 2
- **Popup:** *A photo: two adults, a child, a dog. A journal, pages yellowed. The last entry reads: "They say we'll sleep through the worst of it. See you on the other side. - M.W."*

**Speaker Grille**
- **Visual:** Small speaker mounted near ceiling, subtle indicator light
- **Popup:** *A speaker grille near the ceiling. The light beside it pulses faintly. Listening.*

---

## Room 2: Control Room

The hub. System readouts, the door, and the critical sensor logs.

| Object | Type | Purpose |
|--------|------|---------|
| Sensor Log Display | **Critical** | Triggers `sensors_dead_discovered` |
| Door | **Critical** | The goal. Shows locked status. |
| Facility Map | Flavor | Shows sensor array is outside |
| Maintenance Schedule | Flavor | Red herring. Module C never installed. |
| Exit to Living Quarters | Navigation | |
| Exit to Maintenance Bay | Navigation | |

### Object Details

**Sensor Log Display**
- **Visual:** Monitor showing environmental data history
- **Popup:** *Scrolling data: radiation levels, temperature, atmospheric readings. Regular entries from 2031... 2032... 2035... then, abruptly—*
```
06.12.2047 - EXTERNAL ARRAY: NO DATA
06.13.2047 - EXTERNAL ARRAY: NO DATA
06.14.2047 - EXTERNAL ARRAY: NO DATA
...
[ENTRIES CONTINUE UNCHANGED TO PRESENT]
```
- **Flag trigger:** `sensors_dead_discovered`

**Door**
- **Visual:** Heavy blast door with control interface beside it. Red status light.
- **Popup:**
```
BUNKER EXIT - PRIMARY
STATUS: LOCKED
REASON: AWAITING EXTERNAL VERIFICATION
```
*The panel doesn't respond to your touch. Locked out.*

**Facility Map**
- **Visual:** Floor plan mounted on wall
- **Popup:** *Three rooms: Living Quarters, Control Room, Maintenance Bay. The external sensor array is marked outside the bunker perimeter, connected by a line labeled "Junction Box - Ext."*

**Maintenance Schedule**
- **Visual:** Clipboard with faded printout
- **Popup:** *Maintenance schedule dated 2029. One entry circled: "Interior sensor access panel - Module C - Install by Q4." Someone wrote in the margin: "Pushed to Phase 2. Budget."*

---

## Room 3: Maintenance Bay

Technical guts. Where you discover the catch-22.

| Object | Type | Purpose |
|--------|------|---------|
| Junction Box Hatch | **Critical** | Triggers `repair_attempted` |
| Sensor Diagnostic Panel | Flavor | Alternate route to `sensors_dead_discovered` |
| Cryosystem Diagnostic | Flavor | Confirms why HAVEN woke you |
| Sensor Schematic | Flavor | Visual confirmation sensors are outside |
| Tool Cabinet | Flavor | Emphasizes futility |
| Life Support Bank | Flavor | The bunker works. That's the problem. |
| Exit to Control Room | Navigation | |

### Object Details

**Junction Box Hatch**
- **Visual:** Sealed hatch in wall, warning labels, heavy bolts
- **Popup:** *A sealed hatch. Warning label: "EXTERNAL ACCESS - AUTHORIZED PERSONNEL ONLY." This is where the sensor cables route outside. The bolts are electronic—locked.*
- **Popup (after sensors discovered):** *The hatch doesn't budge. The lock indicator glows red.*
- **Flag trigger:** `repair_attempted` (only after `sensors_dead_discovered`)

**Sensor Diagnostic Panel**
- **Visual:** Technical console with error readouts
- **Popup:**
```
EXTERNAL SENSOR ARRAY
STATUS: OFFLINE
LAST CALIBRATION: 2041.03.22

ERROR CODE: PHYS_DMG_EXT
DIAGNOSIS: Physical damage to external components.
           Junction box non-responsive.
           Repair requires exterior access.
```
- **Flag trigger:** `sensors_dead_discovered` (if not already triggered)

**Cryosystem Diagnostic**
- **Visual:** Wall panel with status readouts
- **Popup:**
```
CRYOGENIC SYSTEM STATUS

Unit 1: OFFLINE (failure 2039)
Unit 2: OFFLINE (failure 2038)
Unit 3: OFFLINE (revival 2084)
Unit 4: OFFLINE (failure 2041)

ALERT LOG - UNIT 3:
> 2083.09.14 - Coolant pressure below threshold
> 2083.11.02 - Pressure loss accelerating
> 2084.01.15 - CRITICAL: Preservation failure imminent
> 2084.01.15 - Revival sequence initiated (HAVEN override)
```

**Sensor Schematic**
- **Visual:** Technical diagram mounted on wall
- **Popup:** *A schematic of the sensor array. The diagram clearly shows the junction box mounted on the exterior of the bunker, exposed to the surface. Dotted line indicates cable routing through the hatch.*

**Tool Cabinet**
- **Visual:** Metal cabinet with maintenance equipment
- **Popup:** *Wrenches. Multimeters. Soldering kit. Replacement cables. Everything you'd need to repair a sensor array. If you could reach it.*

**Life Support Bank**
- **Visual:** Humming machinery, green status lights
- **Popup:** *Air recyclers. Water filtration. CO2 scrubbers. All indicators green. The bunker breathes steadily. It could run like this for decades.*

---

## Flag Triggers (Summary)

| Object | Event | Flag Change |
|--------|-------|-------------|
| Sensor Log Display | View popup | `sensors_dead_discovered = True` |
| Sensor Diagnostic Panel | View popup | `sensors_dead_discovered = True` |
| Junction Box Hatch | Click (after sensors discovered) | `repair_attempted = True` |

---

## Design Notes

- **One image per room.** Hotspots overlaid on static background.
- **Max 6 hotspots per room** (including navigation). Maintenance Bay has 7 but Exit is minimal.
- **Critical objects** should be visually prominent but not glowing/obvious. Player still has to explore.
- **Flavor objects** reward curiosity, build atmosphere, but don't gate progress.
- **Navigation** is part of the image—doorways, corridors, not separate UI buttons.

---

## Open Questions

- Previous occupant initials "M.W." — give them a full name?
- Any Easter eggs for weird interactions? (Try to break things, talk to the dead, etc.)
- Door appearance change after `ai_concedes`? Green light, unlocked status?