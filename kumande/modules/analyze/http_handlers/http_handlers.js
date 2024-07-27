const express = require('express')
const router = new express.Router()
const repoQueryAnalyze = require('../repositories/queries')

/**
 * @swagger
 * tags:
 *   name: Analyze
 *   description: Analyze data for Machine Learning
 */

/**
 * @swagger
 * /api/v1/analyze/next_consume:
 *   get:
 *     summary: Predict / Give consume suggestion for user
 *     tags: [Analyze]
 *     responses:
 *       200:
 *         description: Consume found
 *       404:
 *         description: User not found
 *       422:
 *         description: Your sample is not enough to analyze
 *       500:
 *         description: Internal server error
 */
// Get Analyze Next Consume
router.post('/api/v1/analyze/next_consume', (req, res) => {
    const userId = req.headers['x-custom-header']
    const lat = req.body.lat
    const long = req.body.long
    const date = req.body.date

    repoQueryAnalyze.getAnalyzeConsume(req, res, userId, lat, long, date)
})

module.exports = router