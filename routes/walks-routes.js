const express = require('express')

const walksControllers = require('../controllers/walks-controllers')

const router = express.Router()

router.get('/:wid', walksControllers.getWalkById)

router.get('/user/:uid', walksControllers.getWalkByUserId)

router.post('/', walksControllers.createWalk)

module.exports = router