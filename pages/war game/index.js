const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json()); // to support JSON-encoded bodies

// Import models
const GameState = require('./models/gameState');
const PlayerAction = require('./models/playerAction');

// Define your routes here

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.post('/submit-action', async (req, res) => {
    const { player, actionType, details } = req.body;
    const action = new PlayerAction({ player, actionType, details });
    await action.save();
    res.json({ success: true, message: "Action submitted successfully." });
});

app.get('/game-state', async (req, res) => {
    const gameState = await GameState.findOne();
    res.json(gameState);
});

const cron = require('node-cron');

cron.schedule('*/10 * * * *', async () => {
    console.log('Processing game update...');
    // Fetch all pending actions
    const actions = await PlayerAction.find();
    // Process actions here based on your game logic
    // Update GameState accordingly
    // Optionally clear actions after processing
    await PlayerAction.deleteMany();
    console.log('Game update processed.');
});
