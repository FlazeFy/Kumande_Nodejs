const { Markup } = require('telegraf')

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

module.exports = {
    generateQueryMsg,
    generatePaginationBot
}