const Image = require('../models/Image');
const fabric = require('fabric').fabric;
const Gamedig = require('gamedig');

class ImageController {
    static async index(req, res) {
        const images = await Image.find({});

        res.json(images);
    }

    static async show(req, res) {
        const image = (await Image.find({ id: req.params.id }))[0];

        if (image) {
            const { players, maxplayers } = await Gamedig.query({
                type: image.game.type,
                host: image.game.host,
                port: image.game.port,
            });

            const canvas = new fabric.StaticCanvas(null, { width: image.canvas.backgroundImage.width, height: image.canvas.backgroundImage.height });

            res.writeHead(200, { 'Content-Type': 'image/png' });
        
            const canvasJson = JSON.parse(JSON.stringify(image.canvas));

            canvasJson.objects = canvasJson.objects.map((obj) => {
                obj.text = obj.text.replace('{{ playerCount }}', `${players.length} / ${maxplayers}`);
                return obj;
            });

            canvas.loadFromJSON(canvasJson, function() {
                canvas.renderAll();
            
                var stream = canvas.createPNGStream();
                stream.on('data', function(chunk) {
                    res.write(chunk);
                });
                stream.on('end', function() {
                    res.end();
                });
            });
        } else {
            res.status(404).json({});
        }
    }

    static async create(req, res) {
        const image = new Image(req.body);
    
        try {
            await image.save();

            res.json(image);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    static async upload(req, res) {
        console.log(req.file);
        res.json({
            filename: req.file.filename,
        });
    }
}

module.exports = ImageController;
