const express = require('express')
const app = express()

function getRoute(){
    const routerTag = require('../modules/tags/http_handlers/http_handlers')
    
    app.use(routerTag)

    return app
}

module.exports = getRoute