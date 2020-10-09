const glob = require('glob');
const fs = require('fs');

const generateFontFace = (fontName, fontLocation) => {
    return `@font-face {
        font-family: "${fontName}";
        src: url("${fontLocation.replace('public/', './')}") format('truetype');
    }
    `;
}

glob('fonts/**/*.ttf', (err, files) => {
    if (err) {
        console.log(err);
        return;
    }
 
    const fontMapping = files.reduce((acc, file) => {
        const fontLocationExploded = file.split('/');
        const fileName = fontLocationExploded[fontLocationExploded.length - 1].replace('-Regular', '').replace('.ttf', '');

        if (!fileName.includes('[')) {
            acc[fileName] = file;
        }

        return acc;
    }, {});

    fs.writeFileSync('Font.json', JSON.stringify(fontMapping));
});