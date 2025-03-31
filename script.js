document.addEventListener("DOMContentLoaded", function () {
    const projectList = document.getElementById("project-list");

    const projects = [
        { name: "puzzle converter", url: "./pages/numbers to letters/index.html", description: "Connection clone + builder" },
        { name: "Connections", url: "./pages/connections creation/index.html", description: "Connection clone + builder" },
        { name: "Climbing Scorer", url: "./pages/climbing scorer/index.html", description: "A scoring app for climbing competitions." },
        { name: "Wizard Site", url: "./pages/wizard ui/index.html", description: "Magic Shop" },
        { name: "Wargame", url: "./pages/war game/index.html", description: "War Game start" },
        { name: "JSON builder", url: "./pages/json builder/index.html", description: "JSON builder" },
        { name: "Book reader", url: "./pages/book reader/index.html", description: "book reader" },
        { name: "Database test", url: "./pages/database man/index.html", description: "Database Man" },
        { name: "Audio Site", url: "./pages/audio site/index.html", description: "A website to test text to speach" },
        { name: "Flexbox Demo", url: "./pages/happy little website/index.html", description: "A demo site showcasing the power of CSS Flexbox." },
        { name: "Lore Builder", url: "./pages/lore site/index.html", description: "world site" },
        { name: "Recipie Site", url: "./pages/cooking site/index.html", description: "recipe site" },
        { name: "Peru Trip", url: "./pages/peru itin/index.html", description: "Peru Itin" },
    ];

    // Create and append separate card-like sections for each project
    projects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-item";
        projectCard.innerHTML = `
            <a href="${project.url}">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
            </a>
        `;
        projectList.appendChild(projectCard);
    });

    // Create an interactive grid of squares with more squares
    const interactiveElement = document.getElementById("interactive-element");
    const numberOfSquares = 25; // Adjust the number of squares as needed
    const colorArray = ["#3498db", "#e74c3c", "#27ae60", "#f39c12", "#9b59b6", "#34495e", "#e67e22", "#2ecc71"];

    for (let i = 0; i < numberOfSquares; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.style.backgroundColor = colorArray[0]; // Set initial color
        square.setAttribute("data-color-index", 0); // Add data attribute to store color index
        square.addEventListener("click", () => toggleSquareColor(square, colorArray));
        interactiveElement.appendChild(square);
    }

    const addSquaresButton = document.getElementById("add-squares-button");
    const removeSquaresButton = document.getElementById("remove-squares-button");

    addSquaresButton.addEventListener("click", () => {
        addSquares(interactiveElement, colorArray);
    });
    removeSquaresButton.addEventListener("click", () => removeSquares(interactiveElement));
});

function toggleSquareColor(square, colorArray) {
    const currentIndex = parseInt(square.getAttribute("data-color-index"));
    const nextIndex = (currentIndex + 1) % colorArray.length;
    square.style.backgroundColor = colorArray[nextIndex];
    square.setAttribute("data-color-index", nextIndex); // Update the data attribute
}

function addSquares(interactiveElement, colorArray) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.backgroundColor = colorArray[0]; // Set initial color
    square.setAttribute("data-color-index", 0); // Add data attribute to store color index
    square.addEventListener("click", () => toggleSquareColor(square, colorArray));
    interactiveElement.appendChild(square);
}

function removeSquares(interactiveElement) {
    const squares = interactiveElement.querySelectorAll(".square");
    if (squares.length > 0) {
        interactiveElement.removeChild(squares[squares.length - 1]);
    }
}