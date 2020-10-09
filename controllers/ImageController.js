const Image = require('../models/Image');
const ImageGeneration = require('../models/ImageGeneration');
const fabric = require('fabric').fabric;
const Gamedig = require('gamedig');
const fs = require('fs');
const fonts = require('../Font.json');

class ImageController {
    static async index(req, res) {
        const images = await Image.find({});

        res.json(images);
    }

    static async show(req, res) {
        const imageReadId = req.params.id;
        const image = (await Image.find({ readId: imageReadId }))[0];

        if (!image) {
            res.status(404).json({});
            return;
        }

        const imageId = image.id;

        const lastCheck = (await ImageGeneration.find({ id: imageId }))[0];

        console.log('find cache', lastCheck);

        if (lastCheck && lastCheck.lastGenerateTime > Math.floor(+new Date() / 1000) - 300) {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            console.log('cache hit');
            const readStream = fs.createReadStream(`generatedImages/${imageId}`);

            readStream.on('data', function (chunk) {
                // This just pipes the read stream to the response object (which goes to the client)
                res.write(chunk);
            });
        
            // This catches any errors that happen while creating the readable stream (usually invalid names)
            readStream.on('end', () => {
                res.end();
            });

            return;
        }

        console.log('cache miss');

        if (image) {
            const { players, maxplayers } = await Gamedig.query({
                type: image.game.type,
                host: image.game.host,
                port: image.game.port,
            });

            const canvasJson = JSON.parse(JSON.stringify(image.canvas));
            
            canvasJson.objects.forEach((o) => {
                fabric.nodeCanvas.registerFont(fonts[o.fontFamily], { family: o.fontFamily, weight: 'regular', style: 'normal' });
            });

            const canvas = new fabric.StaticCanvas(null, { width: image.canvas.backgroundImage.width, height: image.canvas.backgroundImage.height });

            res.writeHead(200, { 'Content-Type': 'image/png' });
        
            canvasJson.objects = canvasJson.objects.map((obj) => {
                obj.text = obj.text.replace('{{ playerCount }}', `${players.length} / ${maxplayers}`);
                return obj;
            });

            canvas.loadFromJSON(canvasJson, async function() {
                canvas.renderAll();
            
                const stream = canvas.createPNGStream();

                await ImageGeneration.findOneAndUpdate({
                    id: image.id,
                }, {
                    id: image.id,
                    lastGenerateTime: Math.floor(+new Date() / 1000),
                }, {
                    new: true,
                    upsert: true,
                });

                const out = fs.createWriteStream(`generatedImages/${image.id}`);

                stream.on('data', function(chunk) {
                    out.write(chunk);
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
