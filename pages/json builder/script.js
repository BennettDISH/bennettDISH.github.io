const inputList = document.querySelector('#input-list ul');
const keyField = document.querySelector('#key');
const dataTypeField = document.querySelector('#data-type');
const valueInputContainer = document.querySelector('#value-input');
const addButton = document.querySelector('#add-input');
const exportButton = document.querySelector('#export-button');
const jsonOutput = document.querySelector('#json-output');

const keyValuePairs = {};

dataTypeField.addEventListener('change', () => {
    const selectedDataType = dataTypeField.value;
    renderValueInputField(selectedDataType, valueInputContainer);
});

function updateJsonOutput() {
    const jsonData = JSON.stringify(keyValuePairs, null, 2);
    jsonOutput.textContent = jsonData;
}

addButton.addEventListener('click', () => {
    const key = keyField.value.trim();
    const selectedDataType = dataTypeField.value;
    let value;

    switch (selectedDataType) {
        case 'number':
            value = parseFloat(valueInputContainer.querySelector('input').value);
            break;
        case 'boolean':
            value = valueInputContainer.querySelector('input[type="radio"]:checked').value === 'true';
            break;
        case 'array':
            value = parseArrayValue(valueInputContainer);
            break;
        case 'object':
            value = parseObjectValue(valueInputContainer);
            break;
        default:
            value = valueInputContainer.querySelector('input').value;
    }

    if (key !== '') {
        keyValuePairs[key] = value;
        updateInputList();
        keyField.value = '';
        clearValueInputField(valueInputContainer);
        updateJsonOutput(); // Update the JSON output when a key-value pair is added
    }
});

exportButton.addEventListener('click', () => {
    if (Object.keys(keyValuePairs).length > 0) {
        const jsonData = JSON.stringify(keyValuePairs, null, 2);
        jsonOutput.textContent = jsonData;

        // Create a Blob and download the JSON file
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    }
});

function renderValueInputField(selectedDataType, container) {
    clearValueInputField(container);
    if (selectedDataType === 'array') {
        renderArrayInputField(container);
    } else if (selectedDataType === 'object') {
        renderObjectInputField(container);
    } else {
        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'text');
        inputField.placeholder = `Enter ${selectedDataType}`;
        container.appendChild(inputField);

        if (selectedDataType === 'boolean') {
            const radioTrue = document.createElement('input');
            radioTrue.setAttribute('type', 'radio');
            radioTrue.setAttribute('name', 'bool-value');
            radioTrue.setAttribute('value', 'true');
            const labelTrue = document.createElement('label');
            labelTrue.textContent = 'True';
            container.appendChild(radioTrue);
            container.appendChild(labelTrue);

            const radioFalse = document.createElement('input');
            radioFalse.setAttribute('type', 'radio');
            radioFalse.setAttribute('name', 'bool-value');
            radioFalse.setAttribute('value', 'false');
            const labelFalse = document.createElement('label');
            labelFalse.textContent = 'False';
            container.appendChild(radioFalse);
            container.appendChild(labelFalse);
        }
    }
}

function renderArrayInputField(container) {
    const arrayInput = document.createElement('div');
    arrayInput.classList.add('array-input');

    const arrayValueInput = document.createElement('input');
    arrayValueInput.setAttribute('type', 'text');
    arrayValueInput.placeholder = 'Enter Array Item';
    arrayInput.appendChild(arrayValueInput);

    const addItemButton = document.createElement('button');
    addItemButton.textContent = 'Add Item';
    addItemButton.addEventListener('click', () => {
        const value = arrayValueInput.value.trim();
        if (value !== '') {
            addArrayItem(arrayInput, value);
            arrayValueInput.value = '';
        }
    });

    arrayInput.appendChild(addItemButton);
    container.appendChild(arrayInput);
}

function addArrayItem(arrayInput, value) {
    const arrayItem = document.createElement('div');
    arrayItem.classList.add('array-item');

    const itemValueInput = document.createElement('input');
    itemValueInput.setAttribute('type', 'text');
    itemValueInput.value = value;

    const removeItemButton = document.createElement('button');
    removeItemButton.textContent = 'Remove Item';
    removeItemButton.addEventListener('click', () => {
        removeArrayItem(arrayInput, arrayItem);
        updateJsonOutput();
    });

    arrayItem.appendChild(itemValueInput);
    arrayItem.appendChild(removeItemButton);
    arrayInput.appendChild(arrayItem);
}

function removeArrayItem(arrayInput, arrayItem) {
    arrayInput.removeChild(arrayItem);
}

function parseArrayValue(container) {
    const arrayItems = container.querySelectorAll('.array-item input');
    const items = [];
    arrayItems.forEach((item) => {
        items.push(item.value.trim());
    });
    return items;
}

function renderObjectInputField(container) {
    const objectInput = document.createElement('div');
    objectInput.classList.add('object-input');

    const objectKeyInput = document.createElement('input');
    objectKeyInput.setAttribute('type', 'text');
    objectKeyInput.placeholder = 'Enter Key';
    objectInput.appendChild(objectKeyInput);

    const objectValueType = document.createElement('select');
    objectValueType.id = 'object-value-type';
    objectValueType.innerHTML = `
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="array">Array</option>
        <option value="object">Object</option>
    `;
    objectInput.appendChild(objectValueType);

    const objectValueContainer = document.createElement('div');
    objectValueContainer.id = 'object-value-input';
    objectInput.appendChild(objectValueContainer);

    const addObjectButton = document.createElement('button');
    addObjectButton.textContent = 'Add Key-Value Pair';
    addObjectButton.addEventListener('click', () => {
        const key = objectKeyInput.value.trim();
        const valueType = objectValueType.value;
        const fullPath = path ? `${path}.${key}` : key; // Create a path for the nested key
        const value = parseValue(objectValueContainer, valueType);
        if (key !== '') {
            // Adjust how objects are added to support nested paths
            setObjectValueByKeyPath(keyValuePairs, fullPath, value);
            updateInputList();
            objectKeyInput.value = '';
            clearValueInputField(objectValueContainer);
            updateJsonOutput();
        }
    });

    objectInput.appendChild(addObjectButton);
    container.appendChild(objectInput);

    objectValueType.addEventListener('change', () => {
        const selectedDataType = objectValueType.value;
        renderValueInputField(selectedDataType, objectValueContainer);
    });
}

function addObjectItem(objectInput, key, value) {
    const objectItem = document.createElement('div');
    objectItem.classList.add('object-item');

    const itemKeyInput = document.createElement('input');
    itemKeyInput.setAttribute('type', 'text');
    itemKeyInput.value = key;

    const itemValueType = document.createElement('select');
    itemValueType.innerHTML = `
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="array">Array</option>
        <option value="object">Object</option>
    `;
    itemValueType.addEventListener('change', () => {
        const selectedDataType = itemValueType.value;
        renderValueInputField(selectedDataType, itemValueContainer);
    });

    itemValueType.value = typeof value;

    const itemValueContainer = document.createElement('div');
    itemValueContainer.classList.add('object-value-input');
    renderValueInputField(typeof value, itemValueContainer);

    const removeItemButton = document.createElement('button');
    removeItemButton.textContent = 'Remove Key-Value Pair';
    removeItemButton.addEventListener('click', () => {
        removeObjectItem(objectInput, objectItem);
        updateJsonOutput();
    });

    objectItem.appendChild(itemKeyInput);
    objectItem.appendChild(itemValueType);
    objectItem.appendChild(itemValueContainer);
    objectItem.appendChild(removeItemButton);
    objectInput.appendChild(objectItem);
}

function removeObjectItem(objectInput, objectItem) {
    objectInput.removeChild(objectItem);
}

function parseObjectValue(container) {
    const objectItems = container.querySelectorAll('.object-item');
    const obj = {};
    objectItems.forEach((item) => {
        const key = item.querySelector('input[type="text"]').value.trim();
        const valueType = item.querySelector('select').value;
        const valueContainer = item.querySelector('.object-value-input');
        const value = parseValue(valueContainer, valueType);
        if (key !== '') {
            obj[key] = value;
        }
    });
    return obj;
}

function parseValue(container, valueType) {
    switch (valueType) {
        case 'number':
            return parseFloat(container.querySelector('input').value);
        case 'boolean':
            return container.querySelector('input[type="radio"]:checked').value === 'true';
        case 'array':
            return parseArrayValue(container);
        case 'object':
            return parseObjectValue(container);
        default:
            return container.querySelector('input').value;
    }
}

function clearValueInputField(container) {
    container.innerHTML = '';
}

function updateInputList() {
    inputList.innerHTML = '';
    for (const key in keyValuePairs) {
        const li = document.createElement('li');
        li.textContent = `${key}: ${JSON.stringify(keyValuePairs[key])}`;
        inputList.appendChild(li);
    }
}