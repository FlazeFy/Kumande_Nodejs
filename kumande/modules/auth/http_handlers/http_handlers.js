const express = require('express')
const router = new express.Router()
const repoQueryAuth = require('../repositories/queries')

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /api/v1/external/:scope/:id:
 *   get:
 *     summary: Check username and id by firebase or telegram ID
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Welcome {username}
 *       404:
 *         description: This {context} is not registered to any account
 *       500:
 *         description: Internal server error
 */

router.get('/api/v1/external/:scope/:id', (req, res) => {
    const scope = req.params.scope
    const id = req.params.id
    
    repoQueryAuth.getCheckExternal(req, res, scope, id)
})

module.exports = router