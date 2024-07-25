const Jimp = require('jimp')

const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

const getClosestColorName = (r, g, b) => {
    const colorNames = {
        "black": [0, 0, 0],
        "white": [255, 255, 255],
        "red": [255, 0, 0],
        "lime": [0, 255, 0],
        "blue": [0, 0, 255],
        "yellow": [255, 255, 0],
        "cyan": [0, 255, 255],
        "magenta": [255, 0, 255],
        "silver": [192, 192, 192],
        "gray": [128, 128, 128],
        "maroon": [128, 0, 0],
        "olive": [128, 128, 0],
        "green": [0, 128, 0],
        "purple": [128, 0, 128],
        "teal": [0, 128, 128],
        "navy": [0, 0, 128]
    }

    const euclideanDistance = (c1, c2) => {
        return Math.sqrt(
            (c1[0] - c2[0]) ** 2 +
            (c1[1] - c2[1]) ** 2 +
            (c1[2] - c2[2]) ** 2
        )
    }

    let closestColor = null
    let closestDistance = Infinity

    for (const [name, color] of Object.entries(colorNames)) {
        const distance = euclideanDistance([r, g, b], color)
        if (distance < closestDistance) {
            closestColor = name
            closestDistance = distance
        }
    }

    return closestColor
}

const analyzeColor = async (url) => {
    const image = await Jimp.read(url)
    const totalPixels = image.bitmap.width * image.bitmap.height
    const rgba = image.bitmap.data.reduce((acc, val, idx) => {
        acc[idx % 4] += val
        return acc
    }, [0, 0, 0, 0]).map(val => val / totalPixels)

    const [r, g, b] = rgba.map(Math.round)
    const hexColor = rgbToHex(r, g, b)
    const closestColorName = getClosestColorName(r, g, b)

    const res = `- RGB : (${r}, ${g}, ${b})\n- Hex : ${hexColor}\n- Name : ${closestColorName}`
    return res
}

module.exports = { analyzeColor }
