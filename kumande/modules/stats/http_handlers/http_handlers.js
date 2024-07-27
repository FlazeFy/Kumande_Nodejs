const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries')

/**
 * @swagger
 * tags:
 *   name: Stats
 */

/**
 * @swagger
 * /api/v1/stats/consume_from:
 *   get:
 *     summary: Get total consume by consume from
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Stats found
 *       404:
 *         description: Stats not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/stats/consume_from', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContext(req, res, 'consume', 'consume_from', userId)
})

/**
 * @swagger
 * /api/v1/stats/consume_type:
 *   get:
 *     summary: Get total consume by consume type
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Stats found
 *       404:
 *         description: Stats not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/stats/consume_type', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContext(req, res, 'consume', 'consume_type', userId)
})

/**
 * @swagger
 * /api/v1/stats/consume_provide:
 *   get:
 *     summary: Get total consume by consume provide
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Stats found
 *       404:
 *         description: Stats not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/stats/consume_provide', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContextObject(req, res, 'consume', 'consume_detail', 'provide', userId)
})

/**
 * @swagger
 * /api/v1/stats/consume_main_ing:
 *   get:
 *     summary: Get total consume by consume main ingredient
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Stats found
 *       404:
 *         description: Stats not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/stats/consume_main_ing', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContextObject(req, res, 'consume', 'consume_detail', 'main_ing', userId)
})

/**
 * @swagger
 * /api/v1/stats/count/calorie:
 *   get:
 *     summary: Get last calorie data
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Count Calorie found
 *       404:
 *         description: Count Calorie not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/stats/count/calorie', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getLastCountCalorie(req, res, userId)
})

module.exports = router