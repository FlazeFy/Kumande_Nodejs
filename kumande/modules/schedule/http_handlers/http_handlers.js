const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries')

router.get('/api/v1/schedule', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getMySchedule(req, res, userId)
})

module.exports = router