// Define an object to store climbing grades and their point values for wall grades
const wallGrades = {
    '5.5': 0,
    '5.6': 0,
    '5.7': 0,
    '5.8': 0,
    '5.9': 0,
    '5.10-': 0,
    '5.10': 0,
    '5.10+': 0,
    '5.11-': 0,
    '5.11': 0,
    '5.11+': 0,
    '5.12-': 0,
    '5.12': 0,
    '5.12+': 0,
    '5.13-': 0,
    '5.13': 0,
    '5.13+': 0,
};

// Define an object to store climbing grades and their point values for boulder grades
const boulderGrades = {
    'V0': 0,
    'V1': 0,
    'V2': 0,
    'V3': 0,
    'V4': 0,
    'V5': 0,
    'V6': 0,
    'V7': 0,
    'V8': 0,
    'V9': 0,
    'V10': 0,
    'V11': 0,
};

const wallGradeList = document.getElementById('wall-grades').querySelector('ul');
const boulderGradeList = document.getElementById('boulder-grades').querySelector('ul');
const gradeSelect = document.getElementById('grade-select');
const climbLog = document.getElementById('climb-log');
const totalPoints = document.getElementById('total-points');

// Function to populate the grade list for wall grades
function populateWallGradeList() {
    for (const grade in wallGrades) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="scale">
                <strong class="scale-label">${grade}:</strong>
                <span class="point-value" data-type="wall">${wallGrades[grade]}</span>
                <div class="point-value-buttons">
                    <button class="adjust" data-grade="${grade}" data-action="minus" data-type="wall">-</button>
                    <button class="adjust" data-grade="${grade}" data-action="plus" data-type="wall">+</button>
                </div>
            </div>`;
        wallGradeList.appendChild(listItem);
    }
}

// Function to populate the grade list for boulder grades
function populateBoulderGradeList() {
    for (const grade in boulderGrades) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="scale">
                <strong class="scale-label">${grade}:</strong>
                <span class="point-value" data-type="boulder">${boulderGrades[grade]}</span>
                <div class="point-value-buttons">
                    <button class="adjust" data-grade="${grade}" data-action="minus" data-type="boulder">-</button>
                    <button class="adjust" data-grade="${grade}" data-action="plus" data-type="boulder">+</button>
                </div>
            </div>`;
        boulderGradeList.appendChild(listItem);
    }
}

// Function to adjust point values for grades
function adjustPoints(action, grade, type) {
    if (action === 'plus') {
        if (type === 'wall') {
            wallGrades[grade]++;
        } else if (type === 'boulder') {
            boulderGrades[grade]++;
        }
    } else if (action === 'minus') {
        if (type === 'wall' && wallGrades[grade] > 0) {
            wallGrades[grade]--;
        } else if (type === 'boulder' && boulderGrades[grade] > 0) {
            boulderGrades[grade]--;
        }
    }

    // Update point values on the page
    const pointValueElements = document.querySelectorAll('.point-value[data-type="' + type + '"]');
    pointValueElements.forEach((element) => {
        const gradeName = element.parentElement.querySelector('.adjust').getAttribute('data-grade');
        if (type === 'wall') {
            element.textContent = wallGrades[gradeName];
        } else if (type === 'boulder') {
            element.textContent = boulderGrades[gradeName];
        }
    })
}

// Event listener for reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    // resetPoints();
    resetLog();
});

// Event listener for deleting climb entries
climbLog.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-entry')) {
        const points = parseFloat(e.target.getAttribute('data-points'));
        climbLog.removeChild(e.target.parentElement);
        updateTotalPoints(-points);
    }
});

// Function to reset all point values to 0
function resetPoints() {
    for (const grade in wallGrades) {
        wallGrades[grade] = 0;
    }

    for (const grade in boulderGrades) {
        boulderGrades[grade] = 0;
    }

    const pointValueElements = document.querySelectorAll('.point-value');
    pointValueElements.forEach((element) => {
        element.textContent = 0;
    });

    
}

// Function to reset the climb log
function resetLog() {
    climbLog.innerHTML = '';
    totalPoints.textContent = 0;
    updateTotalPoints(0);
}

// Function to update the total points
function updateTotalPoints(change) {
    const currentTotal = parseFloat(totalPoints.textContent);
    totalPoints.textContent = (currentTotal + change).toFixed(2);
}

// Function to set preset values for all grades
function setPresetValues(type, value) {
    const grades = type === 'wall' ? wallGrades : boulderGrades;

    // Calculate the change in total points
    let totalChange = 0;
    for (const grade in grades) {
        totalChange += value - grades[grade];
        grades[grade] = value;
    }

    // Update point values on the page
    const pointValueElements = document.querySelectorAll('.point-value[data-type="' + type + '"]');
    pointValueElements.forEach((element) => {
        element.textContent = value;
    });
}

// Event listeners for preset buttons
const presetEasyButton = document.getElementById('preset-easy');
const presetMediumButton = document.getElementById('preset-medium');
const presetHardButton = document.getElementById('preset-hard');

presetEasyButton.addEventListener('click', () => {
    setPresetValues('wall', 5);
    setPresetValues('boulder', 3);
});

presetMediumButton.addEventListener('click', () => {
    setPresetValues('wall', 3);
    setPresetValues('boulder', 2);
});

presetHardButton.addEventListener('click', () => {
    setPresetValues('wall', 2);
    setPresetValues('boulder', 1);
});

// Event listeners for adding climbs
const addClimbButton = document.getElementById('add-climb');

addClimbButton.addEventListener('click', () => {
    const selectedGrade = gradeSelect.value;
    addClimb(selectedGrade);
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('adjust')) {
        const grade = e.target.getAttribute('data-grade');
        const action = e.target.getAttribute('data-action');
        const type = e.target.getAttribute('data-type');
        adjustPoints(action, grade, type);
    }
});

// Function to add a climb to the log and update the total points
function addClimb(grade) {
    const selectedType = wallGrades.hasOwnProperty(grade) ? 'wall' : 'boulder';
    const points = selectedType === 'wall' ? wallGrades[grade] : boulderGrades[grade];

    // Create a log entry
    const logEntry = document.createElement('p');
    logEntry.innerHTML = `Climbed ${grade} (+${points} points) <button class="delete-entry" data-points="${points}">Delete</button>`;
    climbLog.appendChild(logEntry);

    // Update the total points
    const currentTotal = parseFloat(totalPoints.textContent);
    totalPoints.textContent = (currentTotal + points).toFixed(2);
}

// Populate the dropdown with climbing grades
function populateDropdown() {
    const select = document.getElementById('grade-select');
    for (const grade in wallGrades) {
        const option = document.createElement('option');
        option.value = grade;
        option.text = grade;
        select.appendChild(option);
    }
    for (const grade in boulderGrades) {
        const option = document.createElement('option');
        option.value = grade;
        option.text = grade;
        select.appendChild(option);
    }
}

const userNameInput = document.getElementById('user-name');
const bgColorPicker = document.getElementById('bg-color');

// Event listener for the name input
userNameInput.addEventListener('input', () => {
    const userName = userNameInput.value;
    document.getElementById('user-greeting').textContent = `Hello, ${userName || 'Climber'}`;
});

// Event listener for the background color picker
bgColorPicker.addEventListener('input', () => {
    const selectedColor = bgColorPicker.value;
    document.body.style.backgroundColor = selectedColor;
});

const toggleScoresButton = document.getElementById('toggle-scores');
const scoreSection = document.getElementById('score-section');

// Event listener for the "Toggle Scores" button
toggleScoresButton.addEventListener('click', () => {
    scoreSection.classList.toggle('hidden');
    toggleScoresButton.textContent = scoreSection.classList.contains('hidden') ? 'Show Scores' : 'Hide Scores';
});


// Initialize the grade lists for wall and boulder grades
populateWallGradeList();
populateBoulderGradeList();
populateDropdown();
