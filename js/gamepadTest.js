let gamepad = null;
let gamepadIndex = null;
let isTestRunning = false;
let currentTestButton = null;
let lastPressTime = 0;
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
        document.getElementById('test-results').classList.remove('visible');
    }
    
    updateTestInstruction();
    updateButtonPressCount();
});

function updateGamepadState() {
    if (gamepadIndex !== null) {
        const gamepads = navigator.getGamepads();
        gamepad = gamepads[gamepadIndex];
        
        if (gamepad) {
            let pressedButtons = [];
            
            gamepad.buttons.forEach((button, index) => {
                if (button.pressed) {
                    pressedButtons.push(`Button ${index}`);
                    document.querySelector(`[data-button="${index}"]`)?.classList.add('active');
                    
                    if (isTestRunning) {
                        handleTestButton(index);
                    }
                } else {
                    document.querySelector(`[data-button="${index}"]`)?.classList.remove('active');
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

function handleTestButton(buttonIndex) {
    if (buttonIndex === buttonSequence[currentTestIndex].id) {
        const currentTime = Date.now();
        const buttonElement = document.querySelector(`[data-button="${buttonIndex}"]`);
        
        // Increment press count
        buttonPresses[buttonIndex] = (buttonPresses[buttonIndex] || 0) + 1;
        updateButtonPressCount();
        
        if (currentTime - lastPressTime < doubleClickThreshold) {
            // Visual feedback for double click
            buttonElement.classList.add('double-click-detected');
            doubleClickedButtons.add(buttonIndex);
            setTimeout(() => {
                buttonElement.classList.remove('double-click-detected');
            }, 500);
        }
        
        lastPressTime = currentTime;
        
        // Move to next button in sequence
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

updateGamepadState();