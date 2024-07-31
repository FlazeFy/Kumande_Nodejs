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

/**
 * @swagger
 * /api/v1/analyze/consume_data/consume_body_relation:
 *   get:
 *     summary: Give analyze for food data to user my body data relation
 *     tags: [Analyze]
 *     responses:
 *       200:
 *         description: Consume found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Get Consume - my body relation
router.post('/api/v1/analyze/consume_data/consume_body_relation', (req, res) => {
    const userId = req.headers['x-custom-header']
    const blood_pressure = req.body.blood_pressure
    const blood_glucose = req.body.blood_glucose
    const calorie = req.body.calorie
    const weight = req.body.weight
    const height = req.body.height
    const date = req.body.date

    repoQueryAnalyze.getAnalyzeConsumeMyBodyRelation(req, res, userId, blood_pressure, blood_glucose, calorie, weight, height, date)
})

module.exports = router