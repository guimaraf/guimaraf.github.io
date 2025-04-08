let gamepad = null;
let gamepadIndex = null;
let isTestRunning = false;
let currentTestButton = null;
const doubleClickThreshold = 300; // ms

const buttonSequence = [
    { id: 12, name: 'D-Pad Up' },
    { id: 15, name: 'D-Pad Right' },
    { id: 13, name: 'D-Pad Down' },
    { id: 14, name: 'D-Pad Left' },
    { id: 0, name: 'A Button' },
    { id: 1, name: 'B Button' },
    { id: 2, name: 'X Button' },
    { id: 3, name: 'Y Button' },
    { id: 4, name: 'LB Button' },
    { id: 5, name: 'RB Button' },
    { id: 6, name: 'LT Button' },
    { id: 7, name: 'RT Button' },
    { id: 8, name: 'Back Button' },
    { id: 9, name: 'Start Button' }
];

let currentTestIndex = 0;
let buttonPresses = {};
let doubleClickedButtons = new Set();
let buttonStates = {};

// Initialize button states
buttonSequence.forEach(button => {
    buttonStates[button.id] = {
        isPressed: false,
        lastPressTime: 0,
        lastReleaseTime: 0,
        pressCount: 0
    };
});

window.addEventListener('gamepadconnected', (e) => {
    gamepadIndex = e.gamepad.index;
    gamepad = e.gamepad;
    document.getElementById('connection-status').textContent = 
        `Gamepad connected: ${gamepad.id}`;
});

window.addEventListener('gamepaddisconnected', (e) => {
    gamepadIndex = null;
    gamepad = null;
    document.getElementById('connection-status').textContent = 
        'No gamepad connected';
});

function updateTestInstruction() {
    const instructionElement = document.getElementById('test-instruction');
    const currentButtonElement = document.getElementById('current-button');
    const testResultsElement = document.getElementById('test-results');
    
    if (!isTestRunning) {
        instructionElement.classList.add('hidden');
        document.querySelectorAll('.next-button').forEach(el => {
            el.classList.remove('next-button');
        });
        return;
    }

    testResultsElement.classList.remove('visible');
    instructionElement.classList.remove('hidden');
    currentButtonElement.textContent = buttonSequence[currentTestIndex].name;

    // Remove previous highlight
    document.querySelectorAll('.next-button').forEach(el => {
        el.classList.remove('next-button');
    });

    // Add highlight to current button
    const currentButton = document.querySelector(`[data-button="${buttonSequence[currentTestIndex].id}"]`);
    if (currentButton) {
        currentButton.classList.add('next-button');
    }
}

function updateButtonPressCount() {
    const pressCountElement = document.getElementById('button-presses');
    let pressText = 'Button press counts:<br>';
    
    buttonSequence.forEach(button => {
        const count = buttonPresses[button.id] || 0;
        pressText += `${button.name}: ${count}<br>`;
    });
    
    pressCountElement.innerHTML = pressText;
}

function showTestResults() {
    const testResultsElement = document.getElementById('test-results');
    let resultsText = 'Test Results:<br>';
    
    if (doubleClickedButtons.size > 0) {
        resultsText += 'Double clicks detected on:<br>';
        doubleClickedButtons.forEach(buttonId => {
            const button = buttonSequence.find(b => b.id === buttonId);
            if (button) {
                resultsText += `- ${button.name}<br>`;
            }
        });
    } else {
        resultsText += 'No double clicks detected on any buttons';
    }
    
    testResultsElement.innerHTML = resultsText;
    testResultsElement.classList.add('visible');
}

document.getElementById('startTest').addEventListener('click', () => {
    if (!gamepad) {
        alert('Please connect a gamepad first!');
        return;
    }

    if (isTestRunning) {
        isTestRunning = false;
        currentTestIndex = 0;
        document.getElementById('startTest').textContent = 'Start Double Click Test';
        showTestResults();
    } else {
        isTestRunning = true;
        currentTestIndex = 0;
        document.getElementById('startTest').textContent = 'Stop Test';
        buttonPresses = {};
        doubleClickedButtons.clear();
        // Reset button states
        buttonSequence.forEach(button => {
            buttonStates[button.id] = {
                isPressed: false,
                lastPressTime: 0,
                lastReleaseTime: 0,
                pressCount: 0
            };
        });
        document.getElementById('test-results').classList.remove('visible');
    }
    
    updateTestInstruction();
    updateButtonPressCount();
});

function checkForDoubleClick(buttonIndex, currentTime) {
    const state = buttonStates[buttonIndex];
    
    // Check if this is a new press (button was previously released)
    if (!state.isPressed) {
        // If we have a previous release and this press is within threshold
        if (state.lastReleaseTime > 0 && 
            currentTime - state.lastReleaseTime < doubleClickThreshold) {
            return true;
        }
        state.lastPressTime = currentTime;
    }
    
    return false;
}

function updateGamepadState() {
    if (gamepadIndex !== null) {
        const gamepads = navigator.getGamepads();
        gamepad = gamepads[gamepadIndex];
        
        if (gamepad) {
            let pressedButtons = [];
            const currentTime = Date.now();
            
            gamepad.buttons.forEach((button, index) => {
                const state = buttonStates[index];
                if (!state) return; // Skip if not a tracked button
                
                if (button.pressed) {
                    pressedButtons.push(`Button ${index}`);
                    document.querySelector(`[data-button="${index}"]`)?.classList.add('active');
                    
                    // Handle button press
                    if (!state.isPressed) {
                        if (isTestRunning && checkForDoubleClick(index, currentTime)) {
                            const buttonElement = document.querySelector(`[data-button="${index}"]`);
                            if (buttonElement) {
                                buttonElement.classList.add('double-click-detected');
                                doubleClickedButtons.add(index);
                                setTimeout(() => {
                                    buttonElement.classList.remove('double-click-detected');
                                }, 500);
                            }
                        }
                        
                        if (isTestRunning && index === buttonSequence[currentTestIndex].id) {
                            buttonPresses[index] = (buttonPresses[index] || 0) + 1;
                            updateButtonPressCount();
                            
                            currentTestIndex++;
                            
                            if (currentTestIndex >= buttonSequence.length) {
                                isTestRunning = false;
                                currentTestIndex = 0;
                                document.getElementById('startTest').textContent = 'Start Double Click Test';
                                showTestResults();
                            }
                            
                            updateTestInstruction();
                        }
                    }
                    state.isPressed = true;
                } else {
                    document.querySelector(`[data-button="${index}"]`)?.classList.remove('active');
                    // Handle button release
                    if (state.isPressed) {
                        state.lastReleaseTime = currentTime;
                        state.isPressed = false;
                    }
                }
            });
            
            document.getElementById('pressed-buttons').textContent = 
                pressedButtons.length > 0 ? 
                `Currently pressed: ${pressedButtons.join(', ')}` : 
                'Currently pressed: None';
        }
    }
    requestAnimationFrame(updateGamepadState);
}

updateGamepadState();