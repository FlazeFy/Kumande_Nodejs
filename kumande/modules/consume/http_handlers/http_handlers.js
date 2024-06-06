const express = require('express')
const router = new express.Router()
const repoQueryConsume = require('../repositories/queries')

// Get All Consume
router.get('/api/v1/consume/:ord', (req, res) => {
    const ord = req.params.ord
    const page = req.query.page ?? 1
    const pageSize = 10
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAllConsume(req, res, ord, '/api/v1/consume/'+ord, page, pageSize, userId)
})
router.get('/api/v1/consume_name', (req, res) => {
    const page = req.query.page ?? 1
    const pageSize = 10
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAllConsumeName(req, res, '/api/v1/consume_name', page, pageSize, userId)
})
router.get('/api/v1/consume/total/day/cal/month/:month/year/:year', (req, res) => {
    const month = req.params.month
    const year = req.params.year
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getDailyConsumeCal(req, res, month, year, userId)
})

module.exports = router