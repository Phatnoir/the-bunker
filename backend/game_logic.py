"""
Game state management for The Bunker.
Handles flags, phases, and state transitions.
"""

from typing import Optional
from enum import Enum


class Phase(Enum):
    ORIENTATION = 1
    SUSPICION = 2
    FAILED_REPAIR = 3
    CONFRONTATION = 4
    RESOLUTION = 5


class Ending(Enum):
    NONE = "none"
    SUCCESS = "success"
    RESIGNATION = "resignation"
    COMPLIANCE = "compliance"


def create_new_game() -> dict:
    """Initialize a fresh game state."""
    return {
        "game_started": True,
        "sensors_dead_discovered": False,
        "repair_attempted": False,
        "paradox_revealed": False,
        "ai_concedes": False,
        "door_opened": False,
        "ending": Ending.NONE.value,
        "current_room": "living_quarters",
        "conversation_history": [],
    }


def get_phase(flags: dict) -> Phase:
    """Determine current phase from flags."""
    if flags["door_opened"]:
        return Phase.RESOLUTION
    if flags["ai_concedes"]:
        return Phase.CONFRONTATION
    if flags["paradox_revealed"]:
        return Phase.FAILED_REPAIR
    if flags["sensors_dead_discovered"]:
        return Phase.SUSPICION
    return Phase.ORIENTATION


# --- Intent Definitions ---

GENERAL_INTENTS = [
    "ask_date",
    "ask_status", 
    "ask_others",
    "ask_haven",
    "ask_outside",
    "ask_door",
    "ask_supplies",
    "ask_directives",
    "ask_sensors",
    "ask_repair",
    "general_conversation",
]

INVALID_DOOR_INTENTS = [
    "demand_door",
    "threaten",
]

VALID_ARGUMENT_INTENTS = [
    "invoke_survival",
    "compare_outcomes",
    "highlight_contradiction",
    "reference_cryo_logic",
]

ENDING_INTENTS = [
    "agree_to_stay",
    "give_up",
]

ALL_INTENTS = (
    GENERAL_INTENTS 
    + INVALID_DOOR_INTENTS 
    + VALID_ARGUMENT_INTENTS 
    + ENDING_INTENTS 
    + ["unknown"]
)


def process_popup_event(flags: dict, event: str, room: str) -> dict:
    """
    Process a popup/click event from the frontend.
    Returns updated flags.
    """
    flags = flags.copy()
    
    if event == "view_sensor_logs" and room == "control_room":
        flags["sensors_dead_discovered"] = True
        
    elif event == "view_sensor_diagnostic" and room == "maintenance_bay":
        flags["sensors_dead_discovered"] = True
        
    elif event == "click_junction_hatch" and room == "maintenance_bay":
        if flags["sensors_dead_discovered"]:
            flags["repair_attempted"] = True
    
    return flags


def process_intent(flags: dict, intent: str) -> dict:
    """
    Process a conversation intent and update flags accordingly.
    Returns updated flags.
    """
    flags = flags.copy()
    phase = get_phase(flags)
    
    # Handle repair discussion -> paradox reveal
    if intent == "ask_repair" and flags["repair_attempted"]:
        flags["paradox_revealed"] = True
    
    # Handle valid arguments (only work after paradox revealed)
    if intent in VALID_ARGUMENT_INTENTS:
        if flags["paradox_revealed"] and not flags["ai_concedes"]:
            flags["ai_concedes"] = True
    
    # Handle door request after AI concedes
    if intent in ["ask_door", "demand_door"]:
        if flags["ai_concedes"] and not flags["door_opened"]:
            flags["door_opened"] = True
            flags["ending"] = Ending.SUCCESS.value
    
    # Handle alternate endings
    if intent == "agree_to_stay":
        if flags["paradox_revealed"]:
            flags["ending"] = Ending.COMPLIANCE.value
    
    if intent == "give_up":
        flags["ending"] = Ending.RESIGNATION.value
    
    return flags


def is_game_over(flags: dict) -> bool:
    """Check if the game has reached an ending."""
    return flags["ending"] != Ending.NONE.value


def get_ending_type(flags: dict) -> Optional[str]:
    """Get the ending type if game is over, else None."""
    if flags["ending"] != Ending.NONE.value:
        return flags["ending"]
    return None