const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameStateSchema = new Schema({
    map: Object, // Simplified, define according to your game needs
    resources: Number,
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameState', gameStateSchema);
