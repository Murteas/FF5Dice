let characterThresholds = {};
let diceCounts = {
    green: 0,
    red: 0,
    blue: 0,
    yellow: 0
};

function populateCharacterDropdown() {
    const select = document.getElementById('characterSelect');
    select.innerHTML = '<option value="">Select Character or Create New</option><option value="new">New Character</option>';
    for (let character in characterThresholds) {
        if (characterThresholds.hasOwnProperty(character)) {
            const option = document.createElement('option');
            option.value = character;
            option.textContent = character;
            select.appendChild(option);
        }
    }
}

function loadSelectedCharacter() {
    const select = document.getElementById('characterSelect');
    const characterName = select.value;
    const newCharacterInput = document.getElementById('characterName');
    const saveButton = document.getElementById('saveButton');

    if (characterName === 'new') {
        newCharacterInput.style.display = 'block';
        saveButton.style.display = 'block';
        newCharacterInput.value = '';
        setDefaultThresholds();
    } else if (characterName) {
        newCharacterInput.style.display = 'none';
        saveButton.style.display = 'none';
        const thresholds = characterThresholds[characterName];
        if (thresholds) {
            document.getElementById('greenThreshold').value = thresholds.green.toString();
            document.getElementById('redThreshold').value = thresholds.red.toString();
            document.getElementById('blueThreshold').value = thresholds.blue.toString();
            document.getElementById('yellowThreshold').value = thresholds.yellow.toString();
        } else {
            setDefaultThresholds();
        }
    }
}

function saveThresholds() {
    const characterName = document.getElementById('characterName').value.trim();
    if (characterName) {
        characterThresholds[characterName] = {
            green: parseInt(document.getElementById('greenThreshold').value),
            red: parseInt(document.getElementById('redThreshold').value),
            blue: parseInt(document.getElementById('blueThreshold').value),
            yellow: parseInt(document.getElementById('yellowThreshold').value)
        };
        localStorage.setItem('characterThresholds', JSON.stringify(characterThresholds));
        alert(`Thresholds saved for ${characterName}`);
        populateCharacterDropdown();
        document.getElementById('characterSelect').value = characterName;
        loadSelectedCharacter();
    } else {
        alert('Please enter a character name');
    }
}

function loadThresholds() {
    try {
        const saved = localStorage.getItem('characterThresholds');
        if (saved) {
            characterThresholds = JSON.parse(saved);
            for (let key in characterThresholds) {
                if (!characterThresholds[key] || typeof characterThresholds[key] !== 'object') {
                    delete characterThresholds[key];
                } else {
                    for (let color in characterThresholds[key]) {
                        if (isNaN(characterThresholds[key][color])) {
                            characterThresholds[key][color] = 4;
                        }
                    }
                }
            }
        } else {
            characterThresholds = {};
        }
    } catch (e) {
        console.error('Error loading thresholds:', e);
        characterThresholds = {};
        localStorage.removeItem('characterThresholds');
        alert('Error loading saved characters. Starting fresh.');
    }
    populateCharacterDropdown();
}

function setDefaultThresholds() {
    document.getElementById('greenThreshold').value = '4';
    document.getElementById('redThreshold').value = '4';
    document.getElementById('blueThreshold').value = '4';
    document.getElementById('yellowThreshold').value = '4';
}

function changeDice(color, delta) {
    diceCounts[color] = Math.max(0, diceCounts[color] + delta);
    document.getElementById(`${color}Count`).textContent = diceCounts[color];
}

function rollDice() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const characterName = document.getElementById('characterSelect').value;
    let thresholds = characterThresholds[characterName] || {
        green: 4, red: 4, blue: 4, yellow: 4
    };

    thresholds = {
        green: parseInt(document.getElementById('greenThreshold').value),
        red: parseInt(document.getElementById('redThreshold').value),
        blue: parseInt(document.getElementById('blueThreshold').value),
        yellow: parseInt(document.getElementById('yellowThreshold').value)
    };

    const colors = ['green', 'red', 'blue', 'yellow'];
    let allResults = '';

    colors.forEach(color => {
        const numDice = diceCounts[color];
        if (numDice > 0) {
            let rolls = [];
            for (let i = 0; i < numDice; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }

            const successThreshold = thresholds[color];
            let diceFaces = rolls.map(roll => {
                const isSuccess = roll >= successThreshold;
                return `<span class="dice-face ${color}-dice ${isSuccess ? 'success' : ''}">${roll}</span>`;
            }).join(' ');

            allResults += `<p class="${color}-text">${color.toUpperCase()} (≥${successThreshold}): ${diceFaces}</p>`;
        }
    });

    if (allResults) {
        resultsDiv.innerHTML = allResults;
    } else {
        resultsDiv.innerHTML = '<p>No dice to roll</p>';
    }
}

window.onload = function() {
    loadThresholds();
    for (let color in diceCounts) {
        document.getElementById(`${color}Count`).textContent = diceCounts[color];
    }
};