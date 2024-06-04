const express = require('express')
const app = express()

function getRoute(){
    const routerTag = require('../modules/tags/http_handlers/http_handlers')
    const routerConsume = require('../modules/consume/http_handlers/http_handlers')
    const routerSchedule = require('../modules/schedule/http_handlers/http_handlers')
    const routerStats = require('../modules/stats/http_handlers/http_handlers')
    
    app.use(routerTag)
    app.use(routerConsume)
    app.use(routerSchedule)
    app.use(routerStats)

    return app
}

module.exports = getRoute