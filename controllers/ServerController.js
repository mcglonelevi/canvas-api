const Gamedig = require('gamedig');

class ServerController {
    static async query(req, res) {
        try {
            await Gamedig.query({
                type: req.body.type,
                host: req.body.ip,
                port: req.body.port,
            });
            res.json({});
        } catch (e) {
            console.log(e);
            res.status(404).json({
                error: 'Server not found',
            });
        }
    }
}

module.exports = ServerController;
