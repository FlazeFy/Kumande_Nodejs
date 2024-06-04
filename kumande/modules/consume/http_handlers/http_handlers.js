const express = require('express')
const router = new express.Router()
const repoQueryConsume = require('../repositories/queries')

// Get All Consume
router.get('/api/v1/consume/:ord', (req, res) => {
    const ord = req.params.ord
    const page = req.query.page ?? 1
    const pageSize = 10

    repoQueryConsume.getAllConsume(req, res, ord, '/api/v1/consume/'+ord, page, pageSize)
})

module.exports = router