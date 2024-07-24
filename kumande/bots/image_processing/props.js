const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const analyzeImageProperties = async (filePath) => {
    const fileInfo = fs.statSync(filePath);

    const image = await Jimp.read(filePath);
    const { width, height } = image.bitmap;
    const fileType = image.getExtension();

    const createdAt = new Date(fileInfo.birthtime).toISOString().replace('T', ' ').substring(0, 19);
    const updatedAt = new Date(fileInfo.mtime).toISOString().replace('T', ' ').substring(0, 19);

    const properties = {
        file_path: filePath,
        file_size: fileInfo.size,
        creation_date: createdAt,
        modification_date: createdAt !== updatedAt ? updatedAt : '-',
        file_type: fileType.toUpperCase(),
        dimensions: `${width}x${height}`
    };

    return properties
};

module.exports = { analyzeImageProperties }
