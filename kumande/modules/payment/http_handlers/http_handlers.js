const express = require('express')
const router = new express.Router()
const repoQueryConsume = require('../repositories/queries')

router.get('/api/v1/payment/total/monthly/:year', (req, res) => {
    const year = req.params.year
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getTotalSpendMonthly(req, res, year, userId)
})
router.get('/api/v1/payment/budget/:year', (req, res) => {
    const year = req.params.year
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAllBudgetByYear(req, res, year, userId)
})

module.exports = router