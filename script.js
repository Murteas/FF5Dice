let characterThresholds = {};

function saveThresholds() {
    const characterName = document.getElementById('characterName').value;
    if (characterName) {
        characterThresholds[characterName] = {
            green: parseInt(document.getElementById('greenThreshold').value),
            yellow: parseInt(document.getElementById('yellowThreshold').value),
            red: parseInt(document.getElementById('redThreshold').value),
            blue: parseInt(document.getElementById('blueThreshold').value)
        };
        alert(`Thresholds saved for ${characterName}`);
        localStorage.setItem('characterThresholds', JSON.stringify(characterThresholds));
    } else {
        alert('Please enter a character name');
    }
}

function loadThresholds() {
    const saved = localStorage.getItem('characterThresholds');
    if (saved) {
        characterThresholds = JSON.parse(saved);
    }
}

function rollDice() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    const characterName = document.getElementById('characterName').value;
    let thresholds = characterThresholds[characterName] || {
        green: 4, yellow: 4, red: 4, blue: 4 // Default thresholds
    };

    const colors = ['green', 'yellow', 'red', 'blue'];
    let allResults = '';

    colors.forEach(color => {
        const numDice = parseInt(document.getElementById(`${color}Dice`).value) || 0;
        if (numDice > 0) {
            let rolls = [];
            for (let i = 0; i < numDice; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1); // Roll a 6-sided die
            }

            const successes = rolls.filter(roll => roll >= thresholds[color]).length;
            allResults += `<p>${color.toUpperCase()} Dice (${numDice} rolled): ${rolls.join(', ')}<br>Successes (≥${thresholds[color]}): ${successes}</p>`;
        }
    });

    if (allResults) {
        resultsDiv.innerHTML = allResults;
    } else {
        resultsDiv.innerHTML = '<p>No dice selected to roll!</p>';
    }
}

// Load saved thresholds when the page loads
window.onload = loadThresholds;