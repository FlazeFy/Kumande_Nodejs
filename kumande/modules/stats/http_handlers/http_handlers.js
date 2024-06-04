const express = require('express')
const router = new express.Router()
const repoQueryTags = require('../repositories/queries')

router.get('/api/v1/stats/consume_from/:ord', (req, res) => {
    const ord = req.params.ord
    repoQueryTags.getTotalItemByContext(req, res, 'consume', 'consume_from', ord)
})
router.get('/api/v1/stats/consume_type/:ord', (req, res) => {
    const ord = req.params.ord
    repoQueryTags.getTotalItemByContext(req, res, 'consume', 'consume_type', ord)
})
router.get('/api/v1/stats/consume_provide/:ord', (req, res) => {
    const ord = req.params.ord
    repoQueryTags.getTotalItemByContextObject(req, res, 'consume', 'consume_detail', 'provide', ord)
})
router.get('/api/v1/stats/consume_main_ing/:ord', (req, res) => {
    const ord = req.params.ord
    repoQueryTags.getTotalItemByContextObject(req, res, 'consume', 'consume_detail', 'main_ing', ord)
})

module.exports = router