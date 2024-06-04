const { Telegraf, Markup } = require('telegraf')
const fs = require('fs')
const configFile = fs.readFileSync('../configs/telegram.json', 'utf8')
const conf = JSON.parse(configFile)

// Services
const { handleShowConsumeHistory } = require('./modules/consume')
const { generatePaginationBot } = require('../packages/helpers/generator')
const { handleShowTag } = require('./modules/tag')

const bot = new Telegraf(conf.TOKEN)

const menuOptions = [
    'Show consume history',
    'Show my calorie needs',
    'Add consume',
    'Update consume',
    'Delete consume',
    'Show schedule',
    'Edit schedule',
    'Show tag',
    'Show stats',
    'Show my profile',
    'Change password'
];

bot.start((ctx) => {
    ctx.reply('Kumande\nMake food scheduling, analyze it, tracking, and choose your meals for tommorrow', 
        Markup.keyboard(menuOptions.map(option => [option])).resize()
    );
});

bot.on('message', async (ctx) => {
    const message = ctx.message.text
    const index = menuOptions.indexOf(message)

    switch (index) {
        case 0:
            let page_0 = 1
            ctx.reply('Showing consume history...')
            const [res_0, page_length_0] = await handleShowConsumeHistory(page_0)
            ctx.reply(res_0, { parse_mode: 'HTML' })
            generatePaginationBot(ctx, page_0, page_length_0)
            break
        case 1:
            ctx.reply('Showing calorie needs...')
            break
        case 2:
            ctx.reply('Preparing field...')
            break
        case 3:
            ctx.reply('Preparing field...')
            break
        case 4:
            ctx.reply('Preparing field...')
            break
        case 5:
            ctx.reply('Showing schedule...')
            break
        case 6:
            ctx.reply('Preparing field...')
            break
        case 7:
            let page_7 = 1
            ctx.reply('Showing tag...')
            const [res_7, page_length_7] = await handleShowTag(page_7)
            ctx.reply(res_7, { parse_mode: 'HTML' })
            generatePaginationBot(ctx, page_7, page_length_7)
            break
        case 8:
            ctx.reply('Showing stats...')
            break
        case 9:
            ctx.reply('Showing my profile...')
            break
        case 10:
            ctx.reply('Preparing field...')
            break
        default:
            ctx.reply('Please select a valid option from the menu.')
            break
    }
});

bot.launch().then(() => {
    console.log('Bot started')
}).catch((err) => {
    console.error('Error starting bot:', err)
});
