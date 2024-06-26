const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries_tags')

// Get All Tag
router.get('/api/v1/tag/:ord', (req, res) => {
    const ord = req.params.ord
    const page = parseInt(req.query.page)
    const pageSize = 10

    repoQueryTags.getAllTags(req, res, ord, '/api/v1/tag/'+ord, page, pageSize)
})

module.exports = router