// Fetch the JSON data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Get the items container element
    const itemsContainer = document.getElementById('items-container');

    // Loop through the items in the data
    data.items.forEach(item => {
      // Create a new item element
      const itemElement = document.createElement('div');
      itemElement.classList.add('item');

      // Create a heading for the item name
      const heading = document.createElement('h2');
      heading.textContent = item.name;

      // Create a paragraph for the item description
      const description = document.createElement('p');
      description.textContent = item.description;

      // Add the heading and description to the item element
      itemElement.appendChild(heading);
      itemElement.appendChild(description);

      // Add the item element to the items container
      itemsContainer.appendChild(itemElement);
    });
  });
