function itemClicked(itemId) {
    const item = document.getElementById(itemId);
    const inventory = document.getElementById('inventory');

    // Clone the item image and prepare it for the inventory
    const itemClone = item.cloneNode(true);
    itemClone.removeAttribute('id'); // Remove the id to avoid duplicates
    itemClone.removeAttribute('onclick'); // Remove the onclick to avoid further interaction
    itemClone.style.display = 'inline'; // Ensure it's visible if hidden

    // Append the cloned item to the inventory
    inventory.appendChild(itemClone);

    // Hide the original item from the wizard's room
    item.style.display = 'none';

    // Optional: Display lore text
    displayLoreText(itemId);
}
