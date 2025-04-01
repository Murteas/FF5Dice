let characterThresholds = {};
let diceCounts = {
    green: 0,
    red: 0,
    blue: 0,
    yellow: 0
};

function populateCharacterDropdown() {
    const select = document.getElementById('characterSelect');
    loadThresholds();
    select.innerHTML = '<option value="">Select Character or Create New</option><option value="new">New Character</option>';
    for (let character in characterThresholds) {
        const option = document.createElement('option');
        option.value = character;
        option.textContent = character;
        select.appendChild(option);
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
        document.getElementById('greenThreshold').value = 4;
        document.getElementById('redThreshold').value = 4;
        document.getElementById('blueThreshold').value = 4;
        document.getElementById('yellowThreshold').value = 4;
    } else if (characterName) {
        newCharacterInput.style.display = 'none';
        saveButton.style.display = 'none';
        const thresholds = characterThresholds[characterName];
        if (thresholds) {
            document.getElementById('greenThreshold').value = thresholds.green;
            document.getElementById('redThreshold').value = thresholds.red;
            document.getElementById('blueThreshold').value = thresholds.blue;
            document.getElementById('yellowThreshold').value = thresholds.yellow;
        }
    }
}

function saveThresholds() {
    const characterName = document.getElementById('characterName').value;
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
    const saved = localStorage.getItem('characterThresholds');
    if (saved) {
        characterThresholds = JSON.parse(saved);
    } else {
        characterThresholds = {};
    }
    populateCharacterDropdown();
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

    const colors = ['green', 'red', 'blue', 'yellow']; // Updated order
    let allResults = '';

    colors.forEach(color => {
        const numDice = diceCounts[color];
        if (numDice > 0) {
            let rolls = [];
            for (let i = 0; i < numDice; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1); // Ensures d6 (1-6)
            }

            const successes = rolls.filter(roll => roll >= thresholds[color]).length;
            let diceFaces = rolls.map(roll => {
                const faceMap = {
                    1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
                };
                return `<span class="dice-face">${faceMap[roll]}</span>`;
            }).join(' ');

            allResults += `<p class="${color}-text">${color.toUpperCase()} Dice (${numDice} rolled): ${diceFaces}<br>Successes (≥${thresholds[color]}): ${successes}</p>`;
        }
    });

    if (allResults) {
        resultsDiv.innerHTML = allResults;
    } else {
        resultsDiv.innerHTML = '<p>No dice selected to roll!</p>';
    }
}

// Initialize dice counts display
window.onload = function() {
    loadThresholds();
    for (let color in diceCounts) {
        document.getElementById(`${color}Count`).textContent = diceCounts[color];
    }
};