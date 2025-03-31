document.addEventListener("DOMContentLoaded", function () {
    const addRecipeButton = document.getElementById("addRecipe");
    const recipeList = document.getElementById("recipeList");

    // Function to fetch and display recipes from JSON
    function displayRecipes() {
        fetch("recipes.json")
            .then((response) => response.json())
            .then((data) => {
                data.recipes.forEach((recipe, index) => {
                    // Create a link to each recipe page
                    const recipeLink = document.createElement("a");
                    recipeLink.setAttribute("href", `recipe.html?index=${index}`);
                    recipeLink.textContent = recipe.title;
                    const listItem = document.createElement("li");
                    listItem.appendChild(recipeLink);
                    recipeList.appendChild(listItem);
                });
            })
            .catch((error) => console.error("Error fetching recipes:", error));
    }

    // Call the function to display recipe links
    displayRecipes();
});
