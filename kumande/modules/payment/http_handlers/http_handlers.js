const express = require('express')
const router = new express.Router()
const repoQueryConsume = require('../repositories/queries')

router.get('/api/v1/payment/total/monthly/:year', (req, res) => {
    const year = req.params.year

    repoQueryConsume.getTotalSpendMonthly(req, res, year)
})
router.get('/api/v1/payment/budget/:year', (req, res) => {
    const year = req.params.year

    repoQueryConsume.getAllBudgetByYear(req, res, year)
})

module.exports = router