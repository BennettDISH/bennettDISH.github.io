let currentTheme = 'light';

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
}

// Number ↔ Letter conversion
function convertNumbers() {
    const input = document.getElementById('numberInput').value;
    const numbers = input.split(/[,\s]+/).map(num => parseInt(num.trim()));
    const letters = numbers.map(num => {
        return (num >= 1 && num <= 26) ? String.fromCharCode(64 + num) : '?';
    });
    document.getElementById('numberResult').textContent = letters.join(' ');
}

function convertLetters() {
    const input = document.getElementById('letterInput').value.toUpperCase();
    const numbers = Array.from(input)
        .filter(char => /[A-Z]/.test(char))
        .map(char => char.charCodeAt(0) - 64);
    document.getElementById('letterResult').textContent = numbers.join(' ');
}

// Caesar Cipher
const slider = document.getElementById('shiftSlider');
const shiftValue = document.getElementById('shiftValue');
slider.oninput = function() {
    shiftValue.textContent = this.value;
}

function shiftChar(char, shift, decrypt = false) {
    if (!/[A-Z]/.test(char)) return char;
    const shift_amount = decrypt ? -shift : shift;
    return String.fromCharCode(((char.charCodeAt(0) - 65 + shift_amount + 26) % 26) + 65);
}

function encrypt() {
    const input = document.getElementById('cipherInput').value.toUpperCase();
    const shift = parseInt(document.getElementById('shiftSlider').value);
    const result = Array.from(input)
        .map(char => shiftChar(char, shift))
        .join('');
    document.getElementById('cipherResult').textContent = result;
}

function decrypt() {
    const input = document.getElementById('cipherInput').value.toUpperCase();
    const shift = parseInt(document.getElementById('shiftSlider').value);
    const result = Array.from(input)
        .map(char => shiftChar(char, shift, true))
        .join('');
    document.getElementById('cipherResult').textContent = result;
}

// Vigenère Cipher
function vigenereChar(char, keyChar, decrypt = false) {
    if (!/[A-Z]/.test(char)) return char;
    const shift = keyChar.charCodeAt(0) - 65;
    return shiftChar(char, shift, decrypt);
}

function vigenereEncrypt() {
    const input = document.getElementById('vigenereInput').value.toUpperCase();
    const key = document.getElementById('keyInput').value.toUpperCase();
    if (!key) {
        alert('Please enter a key');
        return;
    }
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < input.length; i++) {
        if (/[A-Z]/.test(input[i])) {
            result += vigenereChar(input[i], key[keyIndex % key.length]);
            keyIndex++;
        } else {
            result += input[i];
        }
    }
    
    document.getElementById('vigenereResult').textContent = result;
}

function vigenereDecrypt() {
    const input = document.getElementById('vigenereInput').value.toUpperCase();
    const key = document.getElementById('keyInput').value.toUpperCase();
    if (!key) {
        alert('Please enter a key');
        return;
    }
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < input.length; i++) {
        if (/[A-Z]/.test(input[i])) {
            result += vigenereChar(input[i], key[keyIndex % key.length], true);
            keyIndex++;
        } else {
            result += input[i];
        }
    }
    
    document.getElementById('vigenereResult').textContent = result;
}