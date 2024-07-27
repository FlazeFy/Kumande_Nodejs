const express = require('express')
const router = new express.Router()
const repoQueryConsume = require('../repositories/queries')

/**
 * @swagger
 * tags:
 *   name: Payment
 */

/**
 * @swagger
 * /api/v1/payment/total/monthly/:year:
 *   get:
 *     summary: Get total spend per month in a year
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/payment/total/monthly/:year', (req, res) => {
    const year = req.params.year
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getTotalSpendMonthly(req, res, year, userId)
})

/**
 * @swagger
 * /api/v1/payment/budget/:year:
 *   get:
 *     summary: Get monthly budget plan in a year
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Budget found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/payment/budget/:year', (req, res) => {
    const year = req.params.year
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAllBudgetByYear(req, res, year, userId)
})

module.exports = router