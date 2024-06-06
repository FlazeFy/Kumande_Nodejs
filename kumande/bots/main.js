const { Telegraf, Markup } = require('telegraf')
const fs = require('fs')
const configFile = fs.readFileSync('../configs/telegram.json', 'utf8')
const conf = JSON.parse(configFile)

// Services
const { handleShowConsumeHistory, handleShowStats } = require('./modules/consume')
const { generatePaginationBot } = require('../packages/helpers/generator')
const { handleShowTag } = require('./modules/tag')
const { handleAllConsume, handleMySchedule } = require('./modules/document')
const { handleShowSchedule, handleShowStatsMonthly, handleShowBodyInfo } = require('./modules/schedule')
const { handleCheckAccount, handleLogin, handleUpdateTelegramId } = require('./modules/auth')

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
    'Show stats consume',
    'Show my profile',
    'Print Consume',
    'Print Schedule',
    'Show stats monthly',
    'Change password'
];
const menuWelcome = [
    'Login',
    'Register',
    'Feedback',
    'Change password'
];

bot.start( async (ctx) => {
    const userId = ctx.from.id
    const [msg,is_login] = await handleCheckAccount(userId)
    if(is_login == true){
        botState = 'logged_in'
        ctx.reply(msg, 
            Markup.keyboard(menuOptions.map(option => [option])).resize()
        );
    } else {
        ctx.reply(`Kumande\nMake food scheduling, analyze it, tracking, and choose your meals for tommorrow`, 
            Markup.keyboard(menuWelcome.map(option => [option])).resize()
        );
    }
});

bot.on('message', async (ctx) => {
    const message = ctx.message.text
    if (menuWelcome.includes(message)) {
        switch (message) {
            case 'Login':
                botState = 'waiting_email'
                ctx.reply('Please enter your email:')
                break;
            case 'Register':
                ctx.reply('Preparing fields..')
                break;
            case 'Feedback':
                ctx.reply('Preparing fields..')
                break;
            case 'Change password':
                ctx.reply('Preparing fields..')
                break;
            default:
                // Handle other cases or do nothing
                break;
        }
    } else if (botState === 'waiting_email') {
        email = message
        botState = 'waiting_password'
        ctx.reply('Please enter your password:')
    } else if (botState === 'waiting_password') {
        password = message
        const [loginResMsg, loginResIdUser, loginResStatus, username, tokenLogin] = await handleLogin(email, password)

        if(loginResStatus == 200){
            const userId = ctx.from.id
            await handleUpdateTelegramId(userId, tokenLogin)

            ctx.reply(`Welcome to Kumande, ${username}`)
        } else {
            // check this
            ctx.reply(`Login Failed, ${loginResMsg}`)
        }
    } else if (botState === 'logged_in' || menuOptions.includes(message)) {
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
                const res_1 = await handleShowBodyInfo()
                ctx.reply(res_1, { parse_mode: 'HTML' })
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
                const res_5 = await handleShowSchedule()
                ctx.reply(res_5, { parse_mode: 'HTML' })
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
                const res_8 = await handleShowStats()
                ctx.reply(res_8, { parse_mode: 'HTML' })
                break
            case 9:
                ctx.reply('Showing my profile...')
                break
            case 10:
                ctx.reply('Generate document...')
                const [src_10, filename_10] = await handleAllConsume()
                await ctx.replyWithDocument({
                    source: src_10,
                    filename: filename_10
                });
                fs.unlink(src_10, (err) => {
                    if (err) throw err;
                    console.log('Document was deleted')
                });
                break
            case 11:
                ctx.reply('Generate document...')
                const [src_11, filename_11] = await handleMySchedule()
                await ctx.replyWithDocument({
                    source: src_11,
                    filename: filename_11
                });
                fs.unlink(src_11, (err) => {
                    if (err) throw err;
                    console.log('Document was deleted')
                });
                break
            case 12:
                ctx.reply('Showing stats...')
                const res_12 = await handleShowStatsMonthly()
                ctx.reply(res_12, { parse_mode: 'HTML' })
                break
            default:
                ctx.reply('Please select a valid option from the menu.')
                break
        }
    }
});

bot.launch().then(() => {
    console.log('Bot started')
}).catch((err) => {
    console.error('Error starting bot:', err)
});
