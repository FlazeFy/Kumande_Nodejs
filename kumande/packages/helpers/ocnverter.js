const Jimp = require('jimp')
const QrCode = require('qrcode-reader')

function convertPriceNumber(n) {
    const inStr = n.toString()
    let res = ''

    for (let i = 0; i < inStr.length; i++) {
        if (i > 0 && (inStr.length - i) % 3 === 0) {
            res += '.'
        }
        res += inStr[i]
    }

    return res
}

function convertDateTime(val) {
    const date = new Date(val)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const res = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    return res
}

async function decodeQRCode(imagePath) {
    try {
        const image = await Jimp.read(imagePath)
        const qr = new QrCode()

        return new Promise((resolve, reject) => {
            qr.callback = (err, value) => {
                if (err || !value) {
                    return resolve(false)
                }
                resolve(value.result)
            };
            qr.decode(image.bitmap)
        });
    } catch (err) {
        return false
    }
}

function calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
    const toRad = angle => (angle * Math.PI) / 180

    const theta = lon1 - lon2
    let distance = Math.sin(toRad(lat1)) * Math.sin(toRad(lat2)) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(theta))
    
    distance = Math.acos(distance)
    distance = (distance * 180) / Math.PI
    distance = distance * 60 * 1.1515

    if (unit === 'km') {
        distance = distance * 1.609344
    }

    distance = parseFloat(distance.toFixed(2))

    return distance
}


module.exports = {
    convertPriceNumber,
    convertDateTime,
    calculateDistance,
    decodeQRCode
}