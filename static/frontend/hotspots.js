/**
 * Hotspot definitions for each room.
 * 
 * COORDINATE SYSTEM:
 * ==================
 *   x1, y1 = TOP-LEFT corner (percentage from left/top edge)
 *   x2, y2 = BOTTOM-RIGHT corner (percentage from left/top edge)
 * 
 *   (0,0) ────────────────────────── (100,0)
 *     │                                  │
 *     │      (x1,y1)────────┐            │
 *     │         │   BOX     │            │
 *     │         └────────(x2,y2)         │
 *     │                                  │
 *   (0,100) ─────────────────────── (100,100)
 * 
 * HOW TO ADJUST:
 * ==============
 *   1. Press backtick (`) in-game to show debug mode (yellow boxes)
 *   2. Hold backslash (\) to highlight all hotspots
 *   3. Adjust numbers here, save, refresh browser
 * 
 *   - Move box RIGHT: increase both x1 and x2
 *   - Move box DOWN: increase both y1 and y2
 *   - Make box WIDER: increase x2 (or decrease x1)
 *   - Make box TALLER: increase y2 (or decrease y1)
 */

const HOTSPOTS = {
    
    living_quarters: [
        {
            id: "your_cryopod",
            x1: 10, y1: 47,
            x2: 45, y2: 90,
            type: "narrator",
            content: `The pod you woke up in. Frost still clings to the edges. The display flickers:\n\nCRYOGENIC PRESERVATION UNIT - POD 3\nSTATUS: REVIVAL SEQUENCE COMPLETE\n\nOCCUPANT: [REDACTED]\nADMISSION DATE: 09.14.2031\nPRESERVATION STATUS: TERMINATED (SYSTEM FAULT)`,
            event: null
        },
        {
            id: "dead_cryopods",
            x1: 5, y1: 20,
            x2: 50, y2: 45,
            type: "narrator",
            content: `Three pods. Dark displays. Frost obscures the glass.\n\nPOD 1: OFFLINE - PRESERVATION FAILURE - 11.23.2039\nPOD 2: OFFLINE - PRESERVATION FAILURE - 03.17.2038\nPOD 4: OFFLINE - PRESERVATION FAILURE - 07.02.2041\n\nShapes visible through the frost. You don't look too closely.`,
            event: null
        },
        {
            id: "supply_cabinet",
            x1: 54, y1: 30,
            x2: 67, y2: 70,
            type: "narrator",
            content: `Nutrient packs in neat rows. Water recycling containers. Basic medical supplies. Everything labeled and dated.\n\nEnough here for years.`,
            event: null
        },
        {
            id: "personal_effects",
            x1: 90, y1: 50,
            x2: 100, y2: 70,
            type: "narrator",
            content: `A photo: two adults, a child, a dog. A journal, pages yellowed.\n\nThe last entry reads: "They say we'll sleep through the worst of it. See you on the other side. - M.W."`,
            event: null
        },
        {
            id: "speaker_grille",
            x1: 77, y1: 19,
            x2: 82, y2: 26,
            type: "narrator",
            content: `A speaker grille near the ceiling. The light beside it pulses faintly.\n\nListening.`,
            event: null
        },
        {
            id: "exit_to_control",
            x1: 72, y1: 30,
            x2: 85, y2: 65,
            type: "navigation",
            destination: "control_room"
        }
    ],
    
    control_room: [
        {
            id: "door",
            x1: 35, y1: 26,
            x2: 57, y2: 80,
            type: "data",
            content: `BUNKER EXIT - PRIMARY\nSTATUS: LOCKED\nREASON: AWAITING EXTERNAL VERIFICATION\n\n[ACCESS DENIED]`,
            event: null
        },
        {
            id: "facility_map",
            x1: 21, y1: 32,
            x2: 31, y2: 48,
            type: "narrator",
            content: `A facility map. Three rooms: Living Quarters, Control Room, Maintenance Bay.\n\nThe external sensor array is marked outside the bunker perimeter, connected by a line labeled "Junction Box - Ext."`,
            event: null
        },
        {
            id: "sensor_logs",
            x1: 10, y1: 49,
            x2: 25, y2: 65,
            type: "data",
            content: `ENVIRONMENTAL MONITORING LOG\n\n2031.09.15 - RAD: 847 mSv - UNSAFE\n2032.03.22 - RAD: 523 mSv - UNSAFE\n2035.11.08 - RAD: 201 mSv - UNSAFE\n...\n2047.06.11 - RAD: 45 mSv - MARGINAL\n2047.06.12 - EXTERNAL ARRAY: NO DATA\n2047.06.13 - EXTERNAL ARRAY: NO DATA\n2047.06.14 - EXTERNAL ARRAY: NO DATA\n...\n[ENTRIES CONTINUE UNCHANGED TO PRESENT]`,
            event: "view_sensor_logs"
        },
        {
            id: "maintenance_schedule",
            x1: 74, y1: 35,
            x2: 77, y2: 50,
            type: "narrator",
            content: `Maintenance schedule dated 2029. One entry circled:\n\n"Interior sensor access panel - Module C - Install by Q4."\n\nSomeone wrote in the margin: "Pushed to Phase 2. Budget."`,
            event: null
        },
        {
            id: "documents",
            x1: 61, y1: 32,
            x2: 70, y2: 49,
            type: "narrator",
            content: `Technical documentation. Schematics. Most of it is standard facility protocols.\n\nNothing about what to do when the sensors stop working.`,
            event: null
        },
        {
            id: "exit_to_living",
            x1: 0, y1: 29,
            x2: 8, y2: 70,
            type: "navigation",
            destination: "living_quarters"
        },
        {
            id: "exit_to_maintenance",
            x1: 83, y1: 25,
            x2: 96, y2: 54,
            type: "navigation",
            destination: "maintenance_bay"
        }
    ],
    
    maintenance_bay: [
        {
            id: "junction_hatch",
            x1: 10, y1: 30,
            x2: 28, y2: 85,
            type: "data",
            content: `EXTERNAL ACCESS HATCH\nSTATUS: LOCKED\n\n⚠ CAUTION - AUTHORIZED PERSONNEL ONLY\n\nThis is where the sensor cables route outside. The electronic lock glows red.`,
            contentAfterSensors: `EXTERNAL ACCESS HATCH\nSTATUS: LOCKED\n\n⚠ CAUTION - AUTHORIZED PERSONNEL ONLY\n\nThe hatch doesn't budge. The sensor junction is on the other side.\n\nTo repair the sensors, you'd need to go outside.\nTo go outside, HAVEN needs sensor confirmation.\n\n...`,
            event: "click_junction_hatch"
        },
        {
            id: "sensor_diagnostic",
            x1: 31, y1: 42,
            x2: 42, y2: 80,
            type: "data",
            content: `EXTERNAL SENSOR ARRAY\nSTATUS: OFFLINE\nLAST CALIBRATION: 2041.03.22\n\nERROR CODE: PHYS_DMG_EXT\nDIAGNOSIS: Physical damage to external components.\n           Junction box non-responsive.\n           Repair requires exterior access.`,
            event: "view_sensor_diagnostic"
        },
        {
            id: "schematic",
            x1: 44, y1: 32,
            x2: 60, y2: 55,
            type: "narrator",
            content: `A schematic of the sensor array. The diagram clearly shows the junction box mounted on the exterior of the bunker, exposed to the surface.\n\nDotted lines indicate cable routing through the hatch.`,
            event: null
        },
        {
            id: "life_support",
            x1: 62, y1: 15,
            x2: 88, y2: 85,
            type: "narrator",
            content: `Air recyclers. Water filtration. CO2 scrubbers. All indicators green.\n\nThe bunker breathes steadily. It could run like this for decades.\n\nThat's the problem.`,
            event: null
        },
        {
            id: "tool_cabinet",
            x1: 49, y1: 64,
            x2: 60, y2: 85,
            type: "narrator",
            content: `Wrenches. Multimeters. Soldering kit. Replacement cables.\n\nEverything you'd need to repair a sensor array.\n\nIf you could reach it.`,
            event: null
        },
        {
            id: "exit_to_control",
            x1: 95, y1: 31,
            x2: 100, y2: 73,
            type: "navigation",
            destination: "control_room"
        }
    ]
};

// Room navigation map
const ROOM_NAVIGATION = {
    living_quarters: {
        left: null,
        right: "control_room"
    },
    control_room: {
        left: "living_quarters",
        right: "maintenance_bay"
    },
    maintenance_bay: {
        left: "control_room",
        right: null
    }
};

// Room image files
const ROOM_IMAGES = {
    living_quarters: "img/living-quarters.png",
    control_room: "img/control-room.png",
    maintenance_bay: "img/maintenance-bay.png"
};