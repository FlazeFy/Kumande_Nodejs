const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries_tags')

/**
 * @swagger
 * tags:
 *   name: Tag
 */

/**
 * @swagger
 * /api/v1/tag/:ord:
 *   get:
 *     summary: Get all tag
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Tag found
 *       404:
 *         description: Tag not found
 *       422:
 *         description: Ordering is not valid
 *       500:
 *         description: Internal server error
 */

// Get All Tag
router.get('/api/v1/tag/:ord', (req, res) => {
    const ord = req.params.ord
    const page = parseInt(req.query.page)
    const pageSize = 10

    repoQueryTags.getAllTags(req, res, ord, '/api/v1/tag/'+ord, page, pageSize)
})

module.exports = router