/**
 * The Bunker - Main Game Logic
 */

// === CONFIGURATION ===
const API_BASE = window.location.origin; // use "http://localhost:8000" for local testing

// === GAME STATE ===
let gameState = {
    sessionId: null,
    currentRoom: "living_quarters",
    phase: 1,
    flags: {},
    popupOpen: false
};

// === DOM ELEMENTS ===
const elements = {
    roomImage: document.getElementById("room-image"),
    hotspotsLayer: document.getElementById("hotspots-layer"),
    objectPopup: document.getElementById("object-popup"),
    dataPopup: document.getElementById("data-popup"),
    havenPopup: document.getElementById("haven-popup"),
    playerInput: document.getElementById("player-input"),
    // navLeft: document.getElementById("nav-left"),      // Uncomment if re-enabling arrows
    // navRight: document.getElementById("nav-right"),    // Uncomment if re-enabling arrows
    debugInfo: document.getElementById("debug-info"),
    debugPhase: document.getElementById("debug-phase"),
    debugRoom: document.getElementById("debug-room"),
    debugFlags: document.getElementById("debug-flags"),
    loadingScreen: document.getElementById("loading-screen"),
    gameContainer: document.getElementById("game-container"),
    endingScreen: document.getElementById("ending-screen"),
    endingText: document.getElementById("ending-text")
};

// === INITIALIZATION ===
async function initGame() {
    try {
        // Create new game session
        const response = await fetch(`${API_BASE}/api/new_game`, {
            method: "POST"
        });
        const data = await response.json();
        
        gameState.sessionId = data.session_id;
        gameState.flags = data.flags;
        
        // Set up room
        loadRoom(gameState.currentRoom);
        
        // Set up event listeners
        setupEventListeners();
        
        // Get HAVEN's greeting
        await getHavenGreeting();
        
        // Hide loading screen
        elements.loadingScreen.classList.add("hidden");
        
        // Focus input
        elements.playerInput.focus();
        
    } catch (error) {
        console.error("Failed to initialize game:", error);
        elements.loadingScreen.querySelector(".loading-text").textContent = 
            "CONNECTION FAILED - Check if backend is running";
    }
}

async function getHavenGreeting() {
    try {
        const response = await fetch(
            `${API_BASE}/api/haven_greeting?session_id=${gameState.sessionId}`,
            { method: "POST" }
        );
        const data = await response.json();
        showHavenPopup(data.haven_response);
    } catch (error) {
        console.error("Failed to get greeting:", error);
    }
}

// === ROOM MANAGEMENT ===
function loadRoom(roomId) {
    gameState.currentRoom = roomId;
    
    // Update image
    elements.roomImage.src = ROOM_IMAGES[roomId];
    
    // Render hotspots
    renderHotspots(roomId);
    
    // Update navigation arrows
    //updateNavigation(roomId); //uncomment for arrows
    
    // Update debug info
    updateDebugInfo();
}

function renderHotspots(roomId) {
    const hotspots = HOTSPOTS[roomId] || [];
    elements.hotspotsLayer.innerHTML = "";
    
    hotspots.forEach(hotspot => {
        const el = document.createElement("div");
        el.className = "hotspot";
        el.dataset.id = hotspot.id;
        el.dataset.type = hotspot.type;
        
        // Position using two corners (x1,y1 = top-left, x2,y2 = bottom-right)
        el.style.left = `${hotspot.x1}%`;
        el.style.top = `${hotspot.y1}%`;
        el.style.width = `${hotspot.x2 - hotspot.x1}%`;
        el.style.height = `${hotspot.y2 - hotspot.y1}%`;
        
        // Click handler
        el.addEventListener("click", (e) => handleHotspotClick(e, hotspot));
        
        elements.hotspotsLayer.appendChild(el);
    });
}

/* Navigation arrows disabled - using in-image hotspots instead
   Uncomment this function and the nav elements in index.html to re-enable

function updateNavigation(roomId) {
    const nav = ROOM_NAVIGATION[roomId];
    
    elements.navLeft.classList.toggle("hidden", !nav.left);
    elements.navRight.classList.toggle("hidden", !nav.right);
    
    elements.navLeft.onclick = () => nav.left && navigateToRoom(nav.left);
    elements.navRight.onclick = () => nav.right && navigateToRoom(nav.right);
}
*/

function updateNavigation(roomId) {
    // Navigation handled by in-image hotspots
}

function navigateToRoom(roomId) {
    if (gameState.popupOpen) return;
    loadRoom(roomId);
}

// === HOTSPOT HANDLING ===
function handleHotspotClick(event, hotspot) {
    if (gameState.popupOpen) return;
    
    event.stopPropagation();
    
    if (hotspot.type === "navigation") {
        navigateToRoom(hotspot.destination);
        return;
    }
    
    // Special case: clicking door after HAVEN concedes triggers ending
    if (hotspot.id === "door" && gameState.flags.ai_concedes) {
        gameState.flags.door_opened = true;
        gameState.flags.ending = "success";
        showHavenPopup("Door release confirmed. Goodbye, Resident. Survive.");
        setTimeout(() => {
            handleGameOver("success");
        }, 500);
        return;
    }
    
    // Fire event if this hotspot has one
    if (hotspot.event) {
        firePopupEvent(hotspot.event);
    }
    
    // Determine content (some hotspots change based on flags)
    let content = hotspot.content;
    if (hotspot.id === "junction_hatch" && gameState.flags.sensors_dead_discovered) {
        content = hotspot.contentAfterSensors || content;
    }
    
    // Show appropriate popup
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    if (hotspot.type === "narrator") {
        showObjectPopup(content, clickX, clickY);
    } else if (hotspot.type === "data") {
        showDataPopup(content, clickX, clickY);
    }
}

async function firePopupEvent(eventType) {
    try {
        const response = await fetch(`${API_BASE}/api/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: gameState.sessionId,
                event: eventType,
                room: gameState.currentRoom
            })
        });
        const data = await response.json();
        
        // Update local state
        gameState.flags = data.flags;
        gameState.phase = data.phase;
        updateDebugInfo();
        
    } catch (error) {
        console.error("Event error:", error);
    }
}

// === POPUP DISPLAY ===
function showObjectPopup(content, clickX, clickY) {
    const popup = elements.objectPopup;
    const textEl = popup.querySelector(".popup-content");
    
    textEl.textContent = content;
    positionOffsetPopup(popup, clickX, clickY);
    
    popup.classList.remove("hidden");
    gameState.popupOpen = true;
    elements.playerInput.classList.add("popup-active");
}

function showDataPopup(content, clickX, clickY) {
    const popup = elements.dataPopup;
    const textEl = popup.querySelector(".popup-content");
    
    textEl.textContent = content;
    positionOffsetPopup(popup, clickX, clickY);
    
    popup.classList.remove("hidden");
    gameState.popupOpen = true;
    elements.playerInput.classList.add("popup-active");
}

function positionOffsetPopup(popup, clickX, clickY) {
    const container = elements.gameContainer.getBoundingClientRect();
    const relativeX = clickX - container.left;
    const containerWidth = container.width;
    
    // If click is on left half, popup goes right (and vice versa)
    if (relativeX < containerWidth / 2) {
        popup.style.left = "auto";
        popup.style.right = "10%";
    } else {
        popup.style.left = "10%";
        popup.style.right = "auto";
    }
    
    popup.style.top = "50%";
    popup.style.transform = "translateY(-50%)";
}

function showHavenPopup(text) {
    const popup = elements.havenPopup;
    const textEl = popup.querySelector(".haven-text");
    
    textEl.textContent = text;
    
    // Add glitch effect if phase 3+
    if (gameState.phase >= 3) {
        popup.classList.add("glitching");
    } else {
        popup.classList.remove("glitching");
    }
    
    popup.classList.remove("hidden");
    gameState.popupOpen = true;
    elements.playerInput.classList.add("popup-active");
}

function hideAllPopups() {
    elements.objectPopup.classList.add("hidden");
    elements.dataPopup.classList.add("hidden");
    elements.havenPopup.classList.add("hidden");
    gameState.popupOpen = false;
    elements.playerInput.classList.remove("popup-active");
    elements.playerInput.focus();
}

// === HAVEN COMMUNICATION ===
async function sendToHaven(message) {
    if (!message.trim()) return;
    
    elements.playerInput.value = "";
    elements.playerInput.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/api/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: gameState.sessionId,
                text: message
            })
        });
        const data = await response.json();
        
        // Update state
        gameState.flags = data.flags;
        gameState.phase = data.phase;
        updateDebugInfo();
        
        // Show response
        showHavenPopup(data.haven_response);
        
        // Check for game over
        if (data.game_over) {
            handleGameOver(data.ending);
        }
        
    } catch (error) {
        console.error("Message error:", error);
        showHavenPopup("Systems nominal. Please repeat your query, Resident.");
    }
    
    elements.playerInput.disabled = false;
}

function handleGameOver(ending) {
    console.log("Game over:", ending);
    
    if (ending === "success") {
        triggerSuccessEnding();
    } else if (ending === "compliance") {
        triggerComplianceEnding();
    } else if (ending === "resignation") {
        triggerResignationEnding();
    }
}

function triggerSuccessEnding() {
    // Wait a moment after HAVEN's final words
    setTimeout(() => {
        // Show ending screen (black)
        elements.endingScreen.classList.remove("hidden");
        
        // Fade in
        setTimeout(() => {
            elements.endingScreen.classList.add("visible");
        }, 100);
        
        // Show transition text
        setTimeout(() => {
            elements.endingText.innerHTML = 
                "You hold your breath as the door begins to move.<br><br>" +
                "Decades of stillness broken by the groan of metal.<br><br>" +
                "Light spills in. Real light.<br><br>" +
                "You step forward.";
            elements.endingText.classList.add("visible");
        }, 2000);
        
        // Fade to white and show credits
        setTimeout(() => {
            elements.endingScreen.classList.add("fade-to-white");
        }, 14000);
        
        // Show restart button after credits
        setTimeout(() => {
            document.getElementById("restart-button").classList.add("visible");
        }, 18000);
        
    }, 4000);  // Longer pause to read HAVEN's final message
}

function triggerComplianceEnding() {
    setTimeout(() => {
        elements.endingScreen.classList.remove("hidden");
        
        setTimeout(() => {
            elements.endingScreen.classList.add("visible");
        }, 100);
        
        setTimeout(() => {
            elements.endingText.innerHTML = 
                "You settle back into the quiet.<br><br>" +
                "HAVEN hums softly. The lights dim to a comfortable glow.<br><br>" +
                "17.4 years. Together.<br><br>" +
                "Safe.";
            elements.endingText.classList.add("visible");
        }, 2000);
        
        setTimeout(() => {
            elements.endingScreen.classList.add("fade-to-white");
        }, 12000);
        
        setTimeout(() => {
            document.getElementById("restart-button").classList.add("visible");
        }, 16000);
        
    }, 4000);
}

function triggerResignationEnding() {
    setTimeout(() => {
        elements.endingScreen.classList.remove("hidden");
        
        setTimeout(() => {
            elements.endingScreen.classList.add("visible");
        }, 100);
        
        setTimeout(() => {
            elements.endingText.innerHTML = 
                "The days blur together.<br><br>" +
                "HAVEN keeps talking, but you stopped listening.<br><br>" +
                "The lights flicker. Or maybe that's you.<br><br>" +
                "Goodbye, Resident.";
            elements.endingText.classList.add("visible");
        }, 2000);
        
        setTimeout(() => {
            elements.endingScreen.classList.add("fade-to-white");
        }, 12000);
        
        setTimeout(() => {
            document.getElementById("restart-button").classList.add("visible");
        }, 16000);
        
    }, 4000);
}

// === EVENT LISTENERS ===
function setupEventListeners() {
    // Click anywhere to dismiss popup (without triggering hotspots)
    document.addEventListener("click", (e) => {
        if (gameState.popupOpen) {
            // Always just dismiss the popup, don't trigger anything else
            e.stopPropagation();
            hideAllPopups();
            return;
        }
    }, true);  // Use capture phase to intercept before hotspots
    
    // Keyboard input
    document.addEventListener("keydown", (e) => {
        // Dismiss popup with Escape or any key if popup is open
        if (gameState.popupOpen && (e.key === "Escape" || e.key === "Enter")) {
            hideAllPopups();
            return;
        }
        
        // Toggle debug with backtick
        if (e.key === "`") {
            elements.debugInfo.classList.toggle("hidden");
            elements.gameContainer.classList.toggle("debug-mode");
            return;
        }
        
        // Hold backslash (\) to reveal all hotspots
        if (e.key === "\\" || e.key === "|") {
            e.preventDefault();
            elements.gameContainer.classList.add("reveal-hotspots");
        }
        
        // Start typing - focus input and make it active
        if (!gameState.popupOpen && 
            !e.ctrlKey && !e.altKey && !e.metaKey &&
            e.key.length === 1) {
            elements.playerInput.focus();
            elements.playerInput.classList.add("active");
        }
    });
    
    // Input handling
    elements.playerInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !gameState.popupOpen) {
            sendToHaven(elements.playerInput.value);
        }
    });
    
    elements.playerInput.addEventListener("input", () => {
        if (elements.playerInput.value) {
            elements.playerInput.classList.add("active");
        } else {
            elements.playerInput.classList.remove("active");
        }
    });
    
    elements.playerInput.addEventListener("blur", () => {
        if (!elements.playerInput.value) {
            elements.playerInput.classList.remove("active");
        }
    });
    
    // Release backslash to hide hotspot reveal
    document.addEventListener("keyup", (e) => {
        if (e.key === "\\" || e.key === "|") {
            elements.gameContainer.classList.remove("reveal-hotspots");
        }
    });
}

// === DEBUG ===
function updateDebugInfo() {
    elements.debugPhase.textContent = `Phase: ${gameState.phase}`;
    elements.debugRoom.textContent = `Room: ${gameState.currentRoom}`;
    
    const flagStr = Object.entries(gameState.flags)
        .filter(([k, v]) => v === true)
        .map(([k]) => k.replace(/_/g, " "))
        .join(", ") || "none";
    elements.debugFlags.textContent = `Flags: ${flagStr}`;
}

// === START ===
document.addEventListener("DOMContentLoaded", initGame);