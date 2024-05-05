const express = require('express')
const app = express()

function getRoute(){
    const routerTag = require('../modules/tags/http_handlers/http_handlers')
    const routerConsume = require('../modules/consume/http_handlers/http_handlers')
    
    app.use(routerTag)
    app.use(routerConsume)

    return app
}

module.exports = getRoute