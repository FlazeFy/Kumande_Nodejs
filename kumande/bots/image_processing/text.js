const Tesseract = require('tesseract.js')
const Jimp = require('jimp');

const analyzeText = async (url) => {
    try {
        const image = await Jimp.read(url)
        const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)

        const { data: { text } } = await Tesseract.recognize(imageBuffer,'eng')

        return text
    } catch (error) {
        return `Error recognizing text: ${error}`
    }
}

module.exports = { analyzeText }
