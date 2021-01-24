const express = require('express')
const { check } = require('express-validator')

const walksControllers = require('../controllers/walks-controllers')
const fileUpload = require('../middleware/file-upload')

const router = express.Router()

router.get('/:wid', walksControllers.getWalkById)

router.get('/user/:uid', walksControllers.getWalksByUserId)

router.post(
    '/',
    fileUpload.single('image'),
    [ 
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty()
    ], 
    walksControllers.createWalk)

router.patch(
    '/:wid', 
    [
    check('title')
      .not()
      .isEmpty(),
    check('description')
      .isLength({min: 5})
    ], 
    walksControllers.updateWalk)

router.delete('/:wid', walksControllers.deleteWalk)

module.exports = router