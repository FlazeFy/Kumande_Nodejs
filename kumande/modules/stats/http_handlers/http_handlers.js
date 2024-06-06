const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries')

router.get('/api/v1/stats/consume_from/:ord', (req, res) => {
    const ord = req.params.ord
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContext(req, res, 'consume', 'consume_from', ord, userId)
})
router.get('/api/v1/stats/consume_type/:ord', (req, res) => {
    const ord = req.params.ord
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContext(req, res, 'consume', 'consume_type', ord, userId)
})
router.get('/api/v1/stats/consume_provide/:ord', (req, res) => {
    const ord = req.params.ord
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContextObject(req, res, 'consume', 'consume_detail', 'provide', ord, userId)
})
router.get('/api/v1/stats/consume_main_ing/:ord', (req, res) => {
    const ord = req.params.ord
    const userId = req.headers['x-custom-header']

    repoQueryTags.getTotalItemByContextObject(req, res, 'consume', 'consume_detail', 'main_ing', ord, userId)
})
router.get('/api/v1/stats/count/calorie', (req, res) => {
    const userId = req.headers['x-custom-header']

    repoQueryTags.getLastCountCalorie(req, res, userId)
})

module.exports = router