const natural = require('natural');
const { handleAllConsume, handleMySchedule } = require('./modules/document');
const tokenizer = new natural.WordTokenizer()
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn')
const fs = require('fs')

const ai_command = async (text,ctx) => {
    const tokens = tokenizer.tokenize(text.toLowerCase())    
    const sentimentScore = sentiment.getSentiment(tokens)

    // Receive order
    greetings_command = ['hello','hai']
    whos_command = ['who','who are you']
    thanks_command = ['thank','thanks','thx','thank you','thanks a lot']
    self_command = ['my']
    generate_command = ['print','generate','download']

    // Topic 
    consume_topic = ['consume','food','beverage']
    schedule_topic = ['schedule','plan']
    
    if (tokens.some(dt => greetings_command.includes(dt))) {
        ctx.reply("Hi there! How can I assist you today?")
    } else if (tokens.some(dt => whos_command.includes(dt))) {
        ctx.replyWithSticker('CAACAgIAAxkBAAEszOxmohubPSTw0I3mMz-sbODDzA0amQACSgMAArVx2gbCfgb6m0gexDUE')
        ctx.reply("Hello I'm KumBo. Kumande's Bot")
    } else if (tokens.some(dt => thanks_command.includes(dt))) {
        const responses = ['You\'re welcome', 'At my pleasure']
        ctx.reply(responses[Math.floor(Math.random() * responses.length)])
    } else if (tokens.some(dt => self_command.includes(dt))) {
        //
    } else if (tokens.some(dt => generate_command.includes(dt))) {

        if (tokens.some(dt => ['all','everything','kumande'].includes(dt))) {
            ctx.reply('Generate document...')
            const docs_func = [handleAllConsume(), handleMySchedule()]
            for (const func of docs_func) {
                const [src, filename] = await func
                await ctx.replyWithDocument({
                    source: src,
                    filename: filename
                })
                
                try {
                    await fs.unlink(src)
                    console.log('Document was deleted')
                } catch (err) {
                    console.error('Error deleting document:', err)
                }
            }
        } else if(tokens.some(dt => consume_topic.includes(dt)) || tokens.some(dt => schedule_topic.includes(dt))){
            let src, filename
            if (tokens.some(dt => consume_topic.includes(dt))) {
                if(tokens.some(dt => ['data','history'].includes(dt))){
                    [src, filename] = await handleAllConsume()
                }
            } else {
                [src, filename] = await handleMySchedule()
            }
            ctx.reply('Generate document...')
            await ctx.replyWithDocument({
                source: src,
                filename: filename
            });
            fs.unlink(src, (err) => {
                if (err) throw err;
                console.log('Document was deleted')
            });
        } 
    } else {
        ctx.replyWithSticker('CAACAgIAAxkBAAEszPxmohzlh6499jHZKtS-wet8ozd_SgACUQMAArVx2gat6tu-HeOH2zUE')
        ctx.reply(`Sorry i dont understand your message`)
    }
};

module.exports = { ai_command }
