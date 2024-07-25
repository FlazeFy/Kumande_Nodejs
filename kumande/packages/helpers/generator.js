const { Markup } = require('telegraf')
const translate = require('translate-google-api')

function generateQueryMsg(ctx, total) {
    ctx = ctx.charAt(0).toUpperCase() + ctx.slice(1)

    if (total > 0) {
        return ctx + " found"
    } else {
        return ctx + " not found"
    }
}

function generatePaginationBot(ctx, current, length){
    let pageButtons = [];
    for (let i = 1; i <= length; i++) {
        pageButtons.push(`Page ${i}`)
    }
    pageButtons.push('Back to Main Menu')

    ctx.reply(`Page : ${current} / ${length}`, 
        Markup.keyboard(pageButtons.map(button => [button])).resize()
    )
}

async function generateTranslate(text, targetLan) {
    try {
        const translatedText = await translate(text, { to: targetLan})
        return translatedText.join(' ')
    } catch (err) {
        console.error('Error translating text:', err)
    }
}

module.exports = {
    generateQueryMsg,
    generatePaginationBot,
    generateTranslate
}