const express = require('express')
const router = new express.Router()
const repoQueryAnalyze = require('../repositories/queries')

// Get Analyze Next Consume
router.post('/api/v1/analyze/next_consume', (req, res) => {
    const userId = req.headers['x-custom-header']
    const lat = req.body.lat
    const long = req.body.long
    const date = req.body.date

    repoQueryAnalyze.getAnalyzeConsume(req, res, userId, lat, long, date)
})

module.exports = router