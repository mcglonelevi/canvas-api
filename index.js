const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const multer  = require('multer');

app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true, }));

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        cb(null, file.originalname.endsWith('.jpg') || file.originalname.endsWith('.png') || file.originalname.endsWith('.gif') || file.originalname.endsWith('.jpeg'));
    },
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://root:password@localhost', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});

const ImageController = require('./controllers/ImageController');
const ServerController = require('./controllers/ServerController');

app.get('/images', ImageController.index);
app.get('/images/:id', ImageController.show);
app.post('/images', ImageController.create);
app.post('/images/upload', upload.single('background-image'), ImageController.upload)
app.post('/servers/query', ServerController.query);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});