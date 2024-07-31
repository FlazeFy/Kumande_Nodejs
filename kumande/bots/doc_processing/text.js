const pdf = require('pdf-parse')
const fetch = require('node-fetch')

const analyzePDFText = async (url, searchWords) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Failed to fetch PDF')
        }
        const pdfBuffer = await response.buffer()
        const pdfData = await pdf(pdfBuffer)
        const allText = pdfData.text

        const res = searchWords.every(word => allText.includes(word))

        return {
            result: res,
            allText: allText,
            searchWords: searchWords
        }
    } catch (error) {
        return {
            result: false,
            msg: error
        }
    }
}

module.exports = {
    analyzePDFText
}