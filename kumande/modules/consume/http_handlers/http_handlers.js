const express = require('express')
const router = new express.Router()
const repoQueryConsume = require('../repositories/queries')

/**
 * @swagger
 * tags:
 *   name: Consume
 */

/**
 * @swagger
 * /api/v1/consume/:ord:
 *   get:
 *     summary: Get all consume
 *     tags: [Consume]
 *     responses:
 *       200:
 *         description: Consume found
 *       404:
 *         description: Consume not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/consume/:ord', (req, res) => {
    const ord = req.params.ord
    const page = req.query.page ?? 1
    const pageSize = 10
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAllConsume(req, res, ord, '/api/v1/consume/'+ord, page, pageSize, userId)
})

/**
 * @swagger
 * /api/v1/consume_name:
 *   get:
 *     summary: Get all consume
 *     tags: [Consume]
 *     responses:
 *       200:
 *         description: Consume found
 *       404:
 *         description: Consume not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/consume_name', (req, res) => {
    const page = req.query.page ?? 1
    const pageSize = 10
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAllConsumeName(req, res, '/api/v1/consume_name', page, pageSize, userId)
})

/**
 * @swagger
 * /api/v1/consume/analyze/comment:
 *   get:
 *     summary: Get analyze comment
 *     tags: [Consume]
 *     responses:
 *       200:
 *         description: Consume found
 *       404:
 *         description: Consume not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/consume/analyze/comment', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getAnalyzeConsumeComment(req, res, userId)
})

/**
 * @swagger
 * /api/v1/consume/total/day/cal/month/:month/year/:year:
 *   get:
 *     summary: Get daily calorie consumed
 *     tags: [Consume]
 *     responses:
 *       200:
 *         description: Consume found
 *       404:
 *         description: Consume not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/consume/total/day/cal/month/:month/year/:year', (req, res) => {
    const month = req.params.month
    const year = req.params.year
    const userId = req.headers['x-custom-header']

    repoQueryConsume.getDailyConsumeCal(req, res, month, year, userId)
})

module.exports = router