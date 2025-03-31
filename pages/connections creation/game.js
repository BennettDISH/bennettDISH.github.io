let currentGameRound = 0;
let gameData = {
    "gameRounds": [
        {
            "words": [
                "Apple", "Banana", "Cherry", "Date",
                "Python", "Java", "C#", "JavaScript",
                "Rose", "Lily", "Tulip", "Daisy",
                "Dog", "Cat", "Mouse", "Elephant"
            ],
            "groups": [
                ["Apple", "Banana", "Cherry", "Date"],
                ["Python", "Java", "C#", "JavaScript"],
                ["Rose", "Lily", "Tulip", "Daisy"],
                ["Dog", "Cat", "Mouse", "Elephant"]
            ],
            "connections": [
                "Fruits",
                "Programming Languages",
                "Flowers",
                "Animals"
            ],
            "groupColors": ["#FF6347", "#4682B4", "#FFD700", "#90EE90"]
        }
    ]
};
let selectedWords = [];

window.onload = function() {
    displayWords(); // This will load the default game data immediately
};

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
            gameData = JSON.parse(e.target.result); // Make sure this data has the same structure
            currentGameRound = 0; // Assuming your game logic handles multiple rounds, reset to the first round
            displayWords(); // Redraw the board with new data
        };
        reader.readAsText(file);
    } else {
        showMessage('Please upload a valid JSON file.', 'red');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function displayWords() {
    if (!gameData.gameRounds || !gameData.gameRounds.length || !gameData.gameRounds[currentGameRound]) {
        console.error("No valid game data available.");
        return;
    }

    const currentRoundData = gameData.gameRounds[currentGameRound];
    shuffleArray(currentRoundData.words); // Ensure the shuffle function is handling the data correctly
    
    const grid = document.getElementById('wordGrid');
    grid.innerHTML = ''; // Clear previous words
    currentRoundData.words.forEach(word => {
        const button = document.createElement('button');
        button.textContent = word;
        button.className = 'word-button';
        button.onclick = () => toggleWordSelection(word, button);
        grid.appendChild(button);
    });
}

function maxGroupSize() {
    // Ensure that we are reading the max size from the correct round and it's calculated correctly
    if (gameData.gameRounds && gameData.gameRounds[currentGameRound] && gameData.gameRounds[currentGameRound].groups) {
        return Math.max(...gameData.gameRounds[currentGameRound].groups.map(group => group.length));
    }
    return 0; // Return 0 if no groups are defined
}


function showMessage(message, color = 'green') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = color;
    messageDiv.style.opacity = 1;
    setTimeout(() => { messageDiv.style.opacity = 0; }, 2000); // Fade out after 2 seconds
}

function submitGuess() {
    if (selectedWords.length >= 2) {
        const groupIndex = gameData.gameRounds[currentGameRound].groups.findIndex(group =>
            selectedWords.every(val => group.includes(val)) &&
            group.length === selectedWords.length // Ensure exact match in number and members
        );
        if (groupIndex !== -1) {
            showMessage(`Correct! Connection: ${gameData.gameRounds[currentGameRound].connections[groupIndex]}`);
            colorAndDisableGroup(selectedWords, groupIndex);
            // Clear only the selected words that were correct
            selectedWords = selectedWords.filter(word => !gameData.gameRounds[currentGameRound].groups[groupIndex].includes(word));
        } else {
            showMessage('Incorrect, try again!', 'red');
            resetSelections(); // Only reset selections if the guess is wrong
        }
    } else {
        showMessage('Please select at least 2 words.', 'red');
    }
}

function resetSelections() {
    // Clear selected words and update UI to reflect this
    selectedWords = [];
    document.querySelectorAll('.word-button.selected').forEach(button => {
        button.classList.remove('selected'); // Remove the 'selected' class visually
    });
}

function colorAndDisableGroup(words, groupIndex) {
    const buttons = document.querySelectorAll('.word-button');
    buttons.forEach(button => {
        if (words.includes(button.textContent)) {
            button.style.backgroundColor = gameData.gameRounds[currentGameRound].groupColors[groupIndex];
            button.disabled = true;
            button.classList.add('disabled');
            button.classList.remove('selected');  // Remove selected class to show it's now disabled
        }
    });
}

function toggleWordSelection(word, button) {
    if (button.disabled) return; // Skip any action if the button is disabled

    const index = selectedWords.indexOf(word);
    if (index > -1) {
        selectedWords.splice(index, 1); // Deselect the word if already selected
        button.classList.remove('selected');
    } else if (selectedWords.length < maxGroupSize()) {
        selectedWords.push(word); // Add to selection if not disabled
        button.classList.add('selected');
    }
}


let gameConfiguration = {
    gameRounds: [{
        words: [],
        groups: [],
        connections: [],
        groupColors: []
    }]
};

function loadDefaultGameData() {
    displayWords();
}

function addGroup() {
    const wordsInput = document.getElementById('wordsInput').value.split(',').map(word => word.trim());
    const connectionInput = document.getElementById('connectionInput').value;
    const colorInput = document.getElementById('colorInput').value;
    
    if (wordsInput.length > 0 && connectionInput && colorInput) {
        gameConfiguration.gameRounds[0].words = gameConfiguration.gameRounds[0].words.concat(wordsInput);
        gameConfiguration.gameRounds[0].groups.push(wordsInput);
        gameConfiguration.gameRounds[0].connections.push(connectionInput);
        gameConfiguration.gameRounds[0].groupColors.push(colorInput);

        // Clear input fields
        document.getElementById('wordsInput').value = '';
        document.getElementById('connectionInput').value = '';
        document.getElementById('colorInput').value = '#ffffff';
        
        // Update JSON output in textarea
        updateJSONOutput();
    } else {
        alert('Please fill all fields correctly.');
    }
}

function updateJSONOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.value = JSON.stringify(gameConfiguration, null, 2);
}

function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameConfiguration));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "gameData.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}