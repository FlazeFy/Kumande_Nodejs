const { Telegraf, Markup } = require('telegraf')
const fs = require('fs')
const configFile = fs.readFileSync('../configs/telegram.json', 'utf8')
const conf = JSON.parse(configFile)

const bot = new Telegraf(conf.TOKEN)

const menuOptions = [
    'Show consume history',
    'Show my calorie needs',
    'Add consume',
    'Update consume',
    'Delete consume',
    'Show schedule',
    'Edit schedule',
    'Show stats',
    'Show my profile',
    'Change password'
];

bot.start((ctx) => {
    ctx.reply('Kumande\nMake food scheduling, analyze it, tracking, and choose your meals for tommorrow', 
        Markup.keyboard(menuOptions)
    );
});

bot.on('message', (ctx) => {
    const message = ctx.message.text;
    const index = menuOptions.indexOf(message);

    switch (index) {
        case 0:
            ctx.reply('Showing consume history...');
            break;
        case 1:
            ctx.reply('Showing calorie needs...');
            break;
        case 2:
            ctx.reply('Preparing field...');
            break;
        case 3:
            ctx.reply('Preparing field...');
            break;
        case 4:
            ctx.reply('Preparing field...');
            break;
        case 5:
            ctx.reply('Showing schedule...');
            break;
        case 6:
            ctx.reply('Preparing field...');
            break;
        case 7:
            ctx.reply('Showing stats...');
            break;
        case 8:
            ctx.reply('Showing my profile...');
            break;
        case 9:
            ctx.reply('Preparing field...');
            break;
        default:
            ctx.reply('Please select a valid option from the menu.');
            break;
    }
});

bot.launch().then(() => {
    console.log('Bot started')
}).catch((err) => {
    console.error('Error starting bot:', err)
});
