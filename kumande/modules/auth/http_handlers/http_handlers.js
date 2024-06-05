const express = require('express')
const router = new express.Router()
const repoQueryAuth = require('../repositories/queries')

router.get('/api/v1/external/:scope/:id', (req, res) => {
    const scope = req.params.scope
    const id = req.params.id
    
    repoQueryAuth.getCheckExternal(req, res, scope, id)
})

module.exports = router