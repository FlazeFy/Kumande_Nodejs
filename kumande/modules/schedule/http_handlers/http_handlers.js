const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries')

/**
 * @swagger
 * tags:
 *   name: Schedule
 */

/**
 * @swagger
 * /api/v1/schedule:
 *   get:
 *     summary: Get my schedule
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: Schedule found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/schedule', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getMySchedule(req, res, userId)
})

module.exports = router