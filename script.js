// Get the speech synthesis API from the browser
const synth = window.speechSynthesis;

// Get references to all HTML elements needed for interaction
const userInput = document.getElementById("userInput");
const selectedVoice = document.getElementById("selectedVoice");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const voiceSpeed = document.getElementById("voiceSpeed");
const voiceSpeedNum = document.getElementById("voiceSpeedNum");
const voiceVolume = document.getElementById("voiceVolume");
const volumeRange = document.getElementById("volumeRange");

// Attach click event listeners to buttons
playBtn.addEventListener("click", playText);
pauseBtn.addEventListener("click", pauseText);
resumeBtn.addEventListener("click", resumeText);
restartBtn.addEventListener("click", restartAll);

// Attach input event listeners to sliders for updating display
voiceSpeed.addEventListener("input", updateSpeedDisplay);
voiceVolume.addEventListener("input", updateVolumeDisplay);

// List to hold all available voices
let voices = [];

/**
 * Populate the dropdown with available voices
 */
function populateVoiceList() {
    selectedVoice.innerHTML = "";   // Clear current list
    voices = synth.getVoices();     // Get list of voices
    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = voices[i].name + "(" + voices[i].lang + ")";
        option.value = i;
        selectedVoice.appendChild(option); // Add option to dropdown
    }
}

// Call the function immediately to populate voices
populateVoiceList();

// Update voice list again if voices are loaded after the page
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

/**
 * Get the currently selected voice from the dropdown
 */
function selectVoice() {
    const selectedIndex = selectedVoice.value;
    return voices[selectedIndex];
}

/**
 * Update the displayed voice speed value next to the slider
 */
function updateSpeedDisplay() {
    voiceSpeedNum.textContent = parseFloat(voiceSpeed.value).toFixed(1) + "x";
}

/**
 * Update the displayed volume value next to the slider
 */
function updateVolumeDisplay() {
    volumeRange.textContent = parseFloat(voiceVolume.value).toFixed(0);
}

/**
 * Play the text input using the selected voice, speed, and volume
 */
function playText() {
    const inputText = userInput.value.trim(); // Get and clean the text

    if (inputText) {
        synth.cancel(); // Cancel any ongoing speech

        // Disable controls while speaking
        selectedVoice.disabled = true;
        voiceSpeed.disabled = true;
        voiceVolume.disabled = true;

        const utterance = new SpeechSynthesisUtterance(inputText);

        // Re-enable controls after speech ends
        utterance.onend = function() {
            selectedVoice.disabled = false;
            voiceSpeed.disabled = false;
            voiceVolume.disabled = false;
        }

        // Apply selected voice, speed, and volume to utterance
        utterance.voice = selectVoice();
        utterance.rate = parseFloat(voiceSpeed.value);
        utterance.volume = parseFloat(voiceVolume.value);

        // Start speaking
        speechSynthesis.speak(utterance);
    }
}

/**
 * Pause the currently playing speech
 */
function pauseText() {
    speechSynthesis.pause();
}

/**
 * Resume the paused speech
 */
function resumeText() {
    speechSynthesis.resume();
}

/**
 * Reset all controls and text input to their default states
 */
function restartAll() {
    speechSynthesis.cancel();           // Stop any current speech
    userInput.value = "";               // Clear text input
    voiceSpeed.value = 1;               // Reset speed to default
    voiceSpeedNum.textContent = "1.0x";
    selectedVoice.selectedIndex = 0;    // Reset voice selection
    voiceVolume.value = 50;             // Reset volume to 50
    volumeRange.textContent = "50";

    // Re-enable all controls
    selectedVoice.disabled = false;
    voiceSpeed.disabled = false;
    voiceVolume.disabled = false;
}

// Initialize controls and reset values when page loads
window.onload = () => {
    restartAll();           // Clear all fields and states
    updateSpeedDisplay();   // Show default speed value
    updateVolumeDisplay();  // Show default volume value
}