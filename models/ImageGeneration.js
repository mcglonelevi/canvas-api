const mongoose = require('mongoose');

const imageGenSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    lastGenerateTime: { type: Number, required: true },
});

const ImageGeneration = mongoose.model('ImageGeneration', imageGenSchema);

module.exports = ImageGeneration;
