const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    readId: { type: String, required: true, unique: true },
    canvas: {
        version: { type: String, required: true },
        objects: [ { type: mongoose.Schema.Types.Mixed } ],
        backgroundImage: mongoose.Schema.Types.Mixed,
    },
    game: {
        host: { type: String, required: true },
        port: { type: String, required: true },
        type: { type: String, required: true },
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
