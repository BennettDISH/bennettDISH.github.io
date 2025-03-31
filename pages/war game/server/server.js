const express = require('express');
const app = express();
const port = 3000;

let number = 0;  // This will store our number

app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());  // To parse JSON bodies

app.get('/number', (req, res) => {
    res.json({ number });
});

app.post('/number', (req, res) => {
    number++;  // Increment the number
    res.json({ number });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
