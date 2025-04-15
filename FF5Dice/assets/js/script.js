document.addEventListener('DOMContentLoaded', function() {
    let greenCount = 0;
    let redCount = 0;
    let blueCount = 0;
    let yellowCount = 0;

    function updateCount(color) {
        document.getElementById(`${color}Count`).innerText = eval(`${color}Count`);
    }

    window.changeDice = function(color, change) {
        if (eval(`${color}Count`) + change >= 0) {
            eval(`${color}Count += change`);
            updateCount(color);
        }
    };

    window.rollDice = function() {
        const results = [];
        const thresholds = {
            green: parseInt(document.getElementById('greenThreshold').value),
            red: parseInt(document.getElementById('redThreshold').value),
            blue: parseInt(document.getElementById('blueThreshold').value),
            yellow: parseInt(document.getElementById('yellowThreshold').value)
        };

        if (greenCount > 0) {
            results.push(`Rolled ${Math.floor(Math.random() * 6) + 1} for Green (Threshold: ${thresholds.green})`);
        }
        if (redCount > 0) {
            results.push(`Rolled ${Math.floor(Math.random() * 6) + 1} for Red (Threshold: ${thresholds.red})`);
        }
        if (blueCount > 0) {
            results.push(`Rolled ${Math.floor(Math.random() * 6) + 1} for Blue (Threshold: ${thresholds.blue})`);
        }
        if (yellowCount > 0) {
            results.push(`Rolled ${Math.floor(Math.random() * 6) + 1} for Yellow (Threshold: ${thresholds.yellow})`);
        }

        document.getElementById('results').innerText = results.join('\n');
    };
});