const express = require('express')
const router = express.Router()

router.get('/:id/events', (req, res) => {
    res.send("This get request should return a list of events for a specified user.")
})

router.post('/:id/events', (req, res) => {
    res.send("This post request should add an event to a specified user.")
})

module.exports = router;