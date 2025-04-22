const thresholds = {
  green: 4,
  red: 4,
  blue: 4,
  yellow: 4,
};

const diceCounts = {
  green: 0,
  red: 0,
  blue: 0,
  yellow: 0,
};

function loadCharacters() {
  const characters = JSON.parse(localStorage.getItem("characters")) || [];
  const select = document.getElementById("characterSelect");
  select.innerHTML =
    '<option value="">Select Character or Create New</option><option value="new">New Character</option>';
  characters.forEach((char) => {
    const option = document.createElement("option");
    option.value = char.name;
    option.textContent = char.name;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("characters")) {
    localStorage.setItem(
      "characters",
      JSON.stringify([
        {
          name: "Default",
          thresholds: { green: 4, red: 4, blue: 4, yellow: 4 },
        },
      ])
    );
  }
  loadCharacters();
  loadThresholds();

  try {
    document
      .querySelector(".dice-section")
      .addEventListener("click", (event) => {
        handleButtonClick(event);
      });

    document
      .querySelector(".dice-section")
      .addEventListener("touchend", (event) => {
        event.preventDefault();
        handleButtonClick(event);
      });

    // Add event listeners for threshold dropdowns
    ["green", "red", "blue", "yellow"].forEach((color) => {
      document
        .getElementById(`${color}Threshold`)
        .addEventListener("change", (event) => {
          thresholds[color] = parseInt(event.target.value);
          const characterName =
            document.getElementById("characterSelect").value;
          if (characterName && characterName !== "new") {
            characterThresholds[characterName] = { ...thresholds };
            localStorage.setItem(
              "characterThresholds",
              JSON.stringify(characterThresholds)
            );
            let characters =
              JSON.parse(localStorage.getItem("characters")) || [];
            characters = characters.map((char) =>
              char.name === characterName
                ? { name: characterName, thresholds: { ...thresholds } }
                : char
            );
            localStorage.setItem("characters", JSON.stringify(characters));
          }
        });
    });
  } catch (error) {
    console.error("Error setting up event listeners:", error);
  }

  document.getElementById("rollButton").addEventListener("click", rollDice);

  function handleButtonClick(event) {
    const button = event.target;
    const color = button.dataset.color;

    if (!color) {
      console.error("Button clicked with no data-color attribute:", button);
      return;
    }

    if (button.classList.contains("increment")) {
      if (diceCounts[color] < 9) {
        diceCounts[color]++;
        updateDiceCount(color);
      } else {
        console.log(`Max dice reached for ${color}: 9`);
      }
    } else if (button.classList.contains("decrement")) {
      diceCounts[color] = Math.max(0, diceCounts[color] - 1);
      updateDiceCount(color);
    }
  }

  function updateDiceCount(color) {
    const countElement = document.getElementById(`${color}Count`);
    if (countElement) {
      countElement.textContent = diceCounts[color] || 0;
    } else {
      console.error(`Count element for ${color} not found`);
    }
  }

  function rollDice() {
    const results = {
      green: [],
      red: [],
      blue: [],
      yellow: [],
    };

    for (const [color, count] of Object.entries(diceCounts)) {
      for (let i = 0; i < count; i++) {
        const roll = Math.ceil(Math.random() * 6);
        results[color].push({ roll, success: roll >= thresholds[color] });
      }
    }

    displayResults(results);
  }

  function displayResults(results) {
    ["green", "red", "blue", "yellow"].forEach((color) => {
      const resultContainer = document.querySelector(
        `#${color}Results .results`
      );
      resultContainer.innerHTML = "";

      results[color].forEach(({ roll, success }) => {
        const dieSpan = document.createElement("span");
        dieSpan.textContent = roll;
        dieSpan.classList.add("die", `${color}-text`);
        if (success) {
          dieSpan.classList.add("success");
        }
        resultContainer.appendChild(dieSpan);
      });
    });
  }
});

let characterThresholds = {};

function populateCharacterDropdown() {
  const select = document.getElementById("characterSelect");
  select.innerHTML =
    '<option value="">Select Character or Create New</option><option value="new">New Character</option>';
  for (let character in characterThresholds) {
    if (characterThresholds.hasOwnProperty(character)) {
      const option = document.createElement("option");
      option.value = character;
      option.textContent = character;
      select.appendChild(option);
    }
  }
}

function loadSelectedCharacter() {
  const select = document.getElementById("characterSelect");
  const characterName = select.value;
  const newCharacterInput = document.getElementById("characterName");
  const newCharacterButtons = document.getElementById("newCharacterButtons");
  const editCharacterButtons = document.getElementById("editCharacterButtons");

  if (characterName === "new") {
    newCharacterInput.style.display = "block";
    newCharacterButtons.style.display = "flex";
    editCharacterButtons.style.display = "none";
    newCharacterInput.value = "";
    setDefaultThresholds();
  } else if (characterName) {
    newCharacterInput.style.display = "none";
    newCharacterButtons.style.display = "none";
    editCharacterButtons.style.display = "flex";
    const loadedThresholds = characterThresholds[characterName];
    if (loadedThresholds) {
      updateThresholdDisplay(loadedThresholds);
    } else {
      setDefaultThresholds();
    }
  } else {
    newCharacterInput.style.display = "none";
    newCharacterButtons.style.display = "none";
    editCharacterButtons.style.display = "none";
    setDefaultThresholds();
  }
}

function updateThresholdDisplay(loadedThresholds) {
  document.getElementById("greenThreshold").value = loadedThresholds.green;
  document.getElementById("redThreshold").value = loadedThresholds.red;
  document.getElementById("blueThreshold").value = loadedThresholds.blue;
  document.getElementById("yellowThreshold").value = loadedThresholds.yellow;

  // Update the global thresholds object
  thresholds.green = parseInt(document.getElementById("greenThreshold").value);
  thresholds.red = parseInt(document.getElementById("redThreshold").value);
  thresholds.blue = parseInt(document.getElementById("blueThreshold").value);
  thresholds.yellow = parseInt(
    document.getElementById("yellowThreshold").value
  );
}

function saveThresholds() {
  const characterName = document.getElementById("characterName").value.trim();
  if (characterName) {
    const newThresholds = {
      green: parseInt(document.getElementById("greenThreshold").value),
      red: parseInt(document.getElementById("redThreshold").value),
      blue: parseInt(document.getElementById("blueThreshold").value),
      yellow: parseInt(document.getElementById("yellowThreshold").value),
    };
    characterThresholds[characterName] = newThresholds;
    localStorage.setItem(
      "characterThresholds",
      JSON.stringify(characterThresholds)
    );

    let characters = JSON.parse(localStorage.getItem("characters")) || [];
    if (!characters.some((char) => char.name === characterName)) {
      characters.push({ name: characterName, thresholds: newThresholds });
      localStorage.setItem("characters", JSON.stringify(characters));
    }

    // Update global thresholds after saving
    thresholds.green = newThresholds.green;
    thresholds.red = newThresholds.red;
    thresholds.blue = newThresholds.blue;
    thresholds.yellow = newThresholds.yellow;

    alert(`Thresholds saved for ${characterName}`);
    populateCharacterDropdown();
    document.getElementById("characterSelect").value = characterName;
    loadSelectedCharacter();
  } else {
    alert("Please enter a character name");
  }
}

function updateThresholds() {
  const characterName = document.getElementById("characterSelect").value;
  if (characterName && characterName !== "new") {
    const updatedThresholds = {
      green: parseInt(document.getElementById("greenThreshold").value),
      red: parseInt(document.getElementById("redThreshold").value),
      blue: parseInt(document.getElementById("blueThreshold").value),
      yellow: parseInt(document.getElementById("yellowThreshold").value),
    };
    characterThresholds[characterName] = updatedThresholds;
    localStorage.setItem(
      "characterThresholds",
      JSON.stringify(characterThresholds)
    );

    let characters = JSON.parse(localStorage.getItem("characters")) || [];
    characters = characters.map((char) =>
      char.name === characterName
        ? { name: characterName, thresholds: updatedThresholds }
        : char
    );
    localStorage.setItem("characters", JSON.stringify(characters));

    // Update global thresholds after updating
    thresholds.green = updatedThresholds.green;
    thresholds.red = updatedThresholds.red;
    thresholds.blue = updatedThresholds.blue;
    thresholds.yellow = updatedThresholds.yellow;

    alert(`Thresholds updated for ${characterName}`);
    populateCharacterDropdown();
    document.getElementById("characterSelect").value = characterName;
    loadSelectedCharacter();
  } else {
    alert("Please select a character to update");
  }
}

function deleteCharacter() {
  const characterSelect = document.getElementById("characterSelect");
  const name = characterSelect.value;
  if (!name) {
    alert("Please select a character to delete.");
    return;
  }
  if (confirm(`Delete ${name}?`)) {
    let characters = JSON.parse(localStorage.getItem("characters")) || [];
    characters = characters.filter((char) => char.name !== name);
    localStorage.setItem("characters", JSON.stringify(characters));
    delete characterThresholds[name];
    localStorage.setItem(
      "characterThresholds",
      JSON.stringify(characterThresholds)
    );
    loadCharacters();
    document.getElementById("characterName").value = "";
    resetDiceInputs();
  }
}

function loadThresholds() {
  try {
    const saved = localStorage.getItem("characterThresholds");
    if (saved) {
      characterThresholds = JSON.parse(saved);
      for (let key in characterThresholds) {
        if (
          !characterThresholds[key] ||
          typeof characterThresholds[key] !== "object"
        ) {
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
    console.error("Error loading thresholds:", e);
    characterThresholds = {};
    localStorage.removeItem("characterThresholds");
    alert("Error loading saved characters. Starting fresh.");
  }
  populateCharacterDropdown();
}

function setDefaultThresholds() {
  document.getElementById("greenThreshold").value = "4";
  document.getElementById("redThreshold").value = "4";
  document.getElementById("blueThreshold").value = "4";
  document.getElementById("yellowThreshold").value = "4";

  // Update the global thresholds object
  thresholds.green = 4;
  thresholds.red = 4;
  thresholds.blue = 4;
  thresholds.yellow = 4;
}

function resetDiceInputs() {
  diceCounts.green = 0;
  diceCounts.red = 0;
  diceCounts.blue = 0;
  diceCounts.yellow = 0;
  updateDiceCount("green");
  updateDiceCount("red");
  updateDiceCount("blue");
  updateDiceCount("yellow");
}

window.onload = function () {
  loadThresholds();
};
