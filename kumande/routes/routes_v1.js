const express = require('express')
const app = express()

function getRoute(){
    const routerAuth = require('../modules/auth/http_handlers/http_handlers')
    const routerAnalyze = require('../modules/analyze/http_handlers/http_handlers')
    const routerTag = require('../modules/tags/http_handlers/http_handlers')
    const routerConsume = require('../modules/consume/http_handlers/http_handlers')
    const routerSchedule = require('../modules/schedule/http_handlers/http_handlers')
    const routerStats = require('../modules/stats/http_handlers/http_handlers')
    const routerPayment = require('../modules/payment/http_handlers/http_handlers')
    
    app.use(routerTag)
    app.use(routerAnalyze)
    app.use(routerAuth)
    app.use(routerConsume)
    app.use(routerSchedule)
    app.use(routerStats)
    app.use(routerPayment)

    return app
}

module.exports = getRoute