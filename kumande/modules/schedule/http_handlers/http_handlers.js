const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries')

router.get('/api/v1/schedule', (req, res) => {
    repoQueryTags.getMySchedule(req, res)
})

module.exports = router