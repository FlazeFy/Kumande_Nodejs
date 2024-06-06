const { Telegraf,session } = require('telegraf')
const { SQLite } = require('@telegraf/session/sqlite')
const fs = require('fs')
const configFile = fs.readFileSync('../configs/telegram.json', 'utf8')
const conf = JSON.parse(configFile)

const bot = new Telegraf(conf.TOKEN)
const store = SQLite({
    filename: './telegraf-sessions.sqlite',
});
bot.use(session({ store }))

async function getSession(key) {
    try {
        const val = await store.get(key);
        return val
    } catch (err) {
        throw err
    }
}

function postSession(key,val){
    store.set(key,val)
}

module.exports = {
    getSession,
    postSession
}