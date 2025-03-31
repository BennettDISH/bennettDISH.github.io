document.addEventListener("DOMContentLoaded", function () {
    const recipeDetails = document.getElementById("recipeDetails");

    // Get the recipe index from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get("index");

    // Function to fetch and display the selected recipe
    function displayRecipe() {
        fetch("recipes.json")
            .then((response) => response.json())
            .then((data) => {
                const recipe = data.recipes[index];
                // Display the details of the selected recipe
                recipeDetails.innerHTML = `
                    <h2>${recipe.title}</h2>
                    <p>${recipe.description}</p>
                    <ul>
                        ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
                    </ul>
                    <p>Instructions:</p>
                    <p>${recipe.instructions}</p>
                `;
            })
            .catch((error) => console.error("Error fetching recipe:", error));
    }

    // Call the function to display the selected recipe
    displayRecipe();
});
