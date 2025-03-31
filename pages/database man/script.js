// Sample JSON database
let items = [];

// Load items from local storage
if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
}

const itemList = document.getElementById('item-list');
const itemInput = document.getElementById('item-input');
const addButton = document.getElementById('add-button');

// Function to render items in the list
function renderItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item} <button onclick="deleteItem(${index})">Delete</button>`;
        itemList.appendChild(li);
    });
    // Save items to local storage
    localStorage.setItem('items', JSON.stringify(items));
}

// Function to add a new item
function addItem() {
    const newItem = itemInput.value.trim();
    if (newItem) {
        items.push(newItem);
        renderItems();
        itemInput.value = '';
    }
}

// Function to delete an item
function deleteItem(index) {
    items.splice(index, 1);
    renderItems();
}

addButton.addEventListener('click', addItem);
renderItems();
