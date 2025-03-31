const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerActionSchema = new Schema({
    player: String,
    actionType: String,
    details: Object,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlayerAction', playerActionSchema);
