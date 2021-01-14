const express = require('express')

const walksControllers = require('../controllers/walks-controllers')

const router = express.Router()

router.get('/:wid', walksControllers.getWalkById)

router.get('/user/:uid', walksControllers.getWalksByUserId)

router.post('/', walksControllers.createWalk)

router.patch('/:wid', walksControllers.updateWalk)

router.delete('/:wid', walksControllers.deleteWalk)

module.exports = router