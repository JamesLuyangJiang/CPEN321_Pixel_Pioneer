const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("This get request should return a list of recommended places for users without any filteration logic.")
})

router.post('/', (req, res) => {
    res.send("This post request should return a list of recommended places based on the filters provided by the users.")
})

module.exports = router;