const { Telegraf, Markup} = require('telegraf')
const fs = require('fs')
const configFile = fs.readFileSync('../configs/telegram.json', 'utf8')
const conf = JSON.parse(configFile)
const path = require('path');
const axios = require('axios')

// Services
const { handleShowConsumeHistory, handleShowStats, handleShowConsumeName } = require('./modules/consume')
const { generatePaginationBot } = require('../packages/helpers/generator')
const { handleShowTag } = require('./modules/tag')
const { handleAllConsume, handleMySchedule } = require('./modules/document')
const { handleShowSchedule, handleShowStatsMonthly, handleShowBodyInfo } = require('./modules/schedule')
const { handleCheckAccount, handleLogin, handleUpdateTelegramId, handleCheckAccountId, handleUpdateTelegramIdQRCode } = require('./modules/auth')
const { postSession, getSession } = require('../packages/helpers/session')
const { convertDateTime, decodeQRCode } = require('../packages/helpers/ocnverter')
const { analyzePhoto } = require('./image_processing/load');
const { ai_command } = require('./ai');
const { text } = require('stream/consumers');
const { analyzePDFText } = require('./doc_processing/text');
const { add_firestore } = require('./modules/analyze');

const bot = new Telegraf(conf.TOKEN)

const menuOptions = [
    '/Show consume history',
    '/Show my calorie needs',
    '/Add consume',
    '/Update consume',
    '/Delete consume',
    '/Show schedule',
    '/Edit schedule',
    '/Show tag',
    '/Show stats consume',
    '/Show my profile',
    '/Print Consume',
    '/Print Schedule',
    '/Show stats monthly',
    '/Analyze History',
    '/Change password'
];
const menuWelcome = [
    '/Login',
    '/Register',
    '/Feedback',
    '/Change password'
];

bot.start( async (ctx) => {
    const userId = ctx.from.id
    const [msg,is_login,userAppId] = await handleCheckAccount(userId)
    if(is_login == true){
        botState = 'logged_in'
        postSession('kumande_user_id',userAppId)
        postSession('bot_state',botState)
        ctx.reply(`${msg}\nPlease choose an option in Menu:`, 
            Markup.keyboard(menuOptions.map(option => [option])).resize()
        );
    } else {
        ctx.reply(`Kumande\nMake food scheduling, analyze it, tracking, and choose your meals for tommorrow`, 
            Markup.keyboard(menuWelcome.map(option => [option])).resize()
        );
    }
});

bot.on('message', async (ctx) => {
    const telegramId = ctx.from.id
    if(typeof botState === 'undefined'){
        const [msg,is_login,userAppId] = await handleCheckAccount(telegramId)
        if(is_login == true){
            botState = 'logged_in'
            postSession('kumande_user_id',userAppId)
            postSession('bot_state',botState)
            ctx.reply(`${msg}\nPlease choose an option in Menu:`, 
                Markup.keyboard(menuOptions.map(option => [option])).resize()
            );
        }
    } 

    if (ctx.message.text) {
        const message = ctx.message.text
        
        if(message[0] == "/"){
            const accId = null
            const data = {
                telegram_id:telegramId,
                kumande_user_id:accId,
                message:message
            } 
            await add_firestore(data, 'called_menu')
        }

        if (menuWelcome.includes(message)) {
            switch (message) {
                case '/Login':
                    botState = 'waiting_email'
                    postSession('bot_state',botState)
                    ctx.reply('Please enter your email:')
                    break;
                case '/Register':
                    ctx.reply('Preparing fields..')
                    break;
                case '/Feedback':
                    ctx.reply('Preparing fields..')
                    break;
                case '/Change password':
                    ctx.reply('Preparing fields..')
                    break;
                default:
                    // Handle other cases or do nothing
                    break;
            }
        } else if (botState === 'waiting_email') {
            email = message
            botState = 'waiting_password'
            postSession('bot_state',botState)
            ctx.reply('Please enter your password:')
        } else if (botState === 'waiting_password') {
            password = message
            const [loginResMsg, loginResIdUser, loginResStatus, username, tokenLogin] = await handleLogin(email, password)

            if(loginResStatus == 200){
                await handleUpdateTelegramId(telegramId, tokenLogin)

                ctx.reply(`Welcome to Kumande, ${username}`)
                botState = 'logged_in'
                postSession('kumande_user_id',loginResIdUser)
                postSession('bot_state',botState)
                ctx.reply(`${loginResMsg}\nPlease choose an option in Menu:`, 
                    Markup.keyboard(menuOptions.map(option => [option])).resize()
                );
            } else {
                ctx.reply(`Login Failed, ${loginResMsg}`)
            }
        } else if (message === 'Back to Main Menu') {
            botState = 'logged_in'
            postSession('bot_state',botState)
            ctx.reply('Please choose an option in Menu:', 
                Markup.keyboard(menuOptions.map(option => [option])).resize()
            );
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
                    let page_3 = 1
                    ctx.reply('Preparing field...')
                    const res_3 = await handleShowConsumeName(page_3)
                    const buttons_3 = res_3.map(dt => Markup.button.callback(`${dt.consume_name} at ${convertDateTime(dt.created_at)}`, dt.consume_name))
                    buttons_3.push(Markup.button.callback('Back', 'back_button'))
                    buttons_3.push(Markup.button.callback('Next Page', 'next_page'))
                    ctx.reply(`Please choose a consume in Menu to delete:`,
                        Markup.inlineKeyboard(buttons_3, { columns: 1 })
                    )
                    break
                case 4:
                    let page_4 = 1
                    ctx.reply('Preparing field...')
                    const res_4 = await handleShowConsumeName(page_4)
                    const buttons_4 = res_4.map(dt => Markup.button.callback(`${dt.consume_name} at ${convertDateTime(dt.created_at)}`, dt.consume_name))
                    buttons_4.push(Markup.button.callback('Back', 'back_button'))
                    buttons_4.push(Markup.button.callback('Next Page', 'next_page'))
                    ctx.reply(`Please choose a consume in Menu to delete:`,
                        Markup.inlineKeyboard(buttons_4, { columns: 1 })
                    )
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
                    ai_command(message,ctx)
                    break
            }
        }
    } else if(ctx.message.photo){
        const photo = ctx.message.photo[ctx.message.photo.length - 1]
        const fileId = photo.file_id
        const photoPath = path.join(__dirname, `received_photo_${ctx.message.message_id}.jpg`)

        try {
            const fileLink = await ctx.telegram.getFileLink(fileId)
            const response = await axios.get(fileLink.toString(), { responseType: 'stream' })

            const writer = fs.createWriteStream(photoPath)
            response.data.pipe(writer)

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
            })

            const qrContent = await decodeQRCode(photoPath)

            if (qrContent) {
                if(qrContent.length == 36){ // Check QR code value is valid acc ID        
                    await ctx.replyWithHTML(`QR Code Sign In : QR Code Valid!`)

                    const update_tele = await handleUpdateTelegramIdQRCode(telegramId, qrContent) // Update tele id without token 
                    if(update_tele){
                        const [msg,is_login,userAppId] = await handleCheckAccountId(qrContent) // Get username after success update tele id

                        if(is_login){
                            botState = 'logged_in'
                            postSession('kumande_user_id',userAppId)
                            postSession('bot_state',botState)
                            await ctx.replyWithHTML(`QR Code Sign In : Success, ${msg}!`)
                            ctx.reply(`${msg}\nPlease choose an option in Menu:`, 
                                Markup.keyboard(menuOptions.map(option => [option])).resize()
                            );
                        } else {
                            await ctx.replyWithHTML(`QR Code Sign In : Account Not Found!`)
                        }
                    } else {
                        await ctx.replyWithHTML(`QR Code Sign In : Failed!`)
                    }
                } else {
                    await ctx.replyWithHTML(`QR Code Sign In : Not Valid!`)
                }
            } else {
                const res = await analyzePhoto(photoPath, ctx.from.id)
                await ctx.replyWithHTML(`Photo successfully analyzed...\n\n${res}`)
            }
        } catch (error) {
            await ctx.reply(`Failed to analyze the photo: ${error.message}`)
        } finally {
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath)
            }
        }
    } else if(ctx.message.document){
        try {
            const fileId = ctx.message.document.file_id
            const fileInfo = await ctx.telegram.getFile(fileId)
            const fileLink = await ctx.telegram.getFileLink(fileId)
            const allowedType = ['application/pdf']
            const allowedSize = 5 * 1024 * 1024

            if (!allowedType.includes(ctx.message.document.mime_type)) {
                await ctx.reply('Document Analyze : File Type Invalid. Should be pdf')
            } else {
                if(fileInfo.file_size > allowedSize){
                    await ctx.reply('Document Analyze : File Size Invalid. Should be less than 5 mb')
                } else {
                    await ctx.reply('Document Analyze : File Type & Size Valid!')

                    const search_my_schedule_marks = ['My Schedule','Time / Day','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Breakfast','Lunch','Dinner']
                    const is_valid_my_schedule = await analyzePDFText(fileLink.href, search_my_schedule_marks)
                    if(is_valid_my_schedule.result){
                        await ctx.reply('Document Analyze : My Schedule document detected')

                        // Remove marks from all text detected
                        let allText = is_valid_my_schedule.allText
                        search_my_schedule_marks.forEach(dt => {
                            const regex = new RegExp(dt, 'g')
                            allText = allText.replace(regex, '')
                        })
                        allText = allText.replace(/-{2,}/g, ' ').trim()

                        // Filter out consume
                        const parts = allText.split(/(?=#)/).filter(part => part.trim().startsWith('#'))
                        const consumes = parts.map(part => part.replace(/^#/, '').trim().replace('-',''))
                        let consumeList = ''
                        if(consumes.length > 0){
                            consumeList += `We found ${consumes.length} consume. Here's the list:\n\n`
                            consumes.forEach((dt, idx)=>{
                                consumeList += `- ${dt}\n`
                            })
                        } else {
                            consumeList += 'No Consume Detected'
                        }
                        await ctx.reply(`Document Analyze : ${consumeList}`)
                    } else {
                        await ctx.reply('Document Analyze : Unknown document')
                    }
                } 
            }
        } catch (error) {
            await ctx.reply(`Failed to analyze the document: ${error.message}`)
        }
    } 
});

bot.launch().then(() => {
    console.log('Bot started')
}).catch((err) => {
    console.error('Error starting bot:', err)
});
