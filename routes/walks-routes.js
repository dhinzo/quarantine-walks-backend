const express = require('express')


const router = express.Router()

router.get('/', (req, res, next) => {
    console.log('GET request in walks')
    res.json({message: 'it works!'})
})

module.exports = router