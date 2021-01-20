const { v4: uuidv4 } = require('uuid')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const getCoordsForAddress = require('../util/location')
const HttpError = require('../models/http-error')
const Walk = require('../models/walk')
const User = require('../models/user')



const getWalkById = async (req, res, next) => {
    const walkId = req.params.wid

    let walk
    try {
        walk = await Walk.findById(walkId)
    } catch (err) {
        const error = new HttpError("Something went wrong... couldn't find that walk.", 500)
        return next(error)
    }
        
    if (!walk) {
        const error = new HttpError('Could not find a walk with that id...', 404)
        return next(error)        
    }
    res.json({ walk: walk.toObject( { getters: true }) })
}

const getWalksByUserId = async (req, res, next) => {
    const userId = req.params.uid
    
    // instantiate variable for function
    // let userWalks
    let userWithWalks

    try  {
        // .find({ property: variable })
        userWithWalks = await User.findById(userId).populate('walks')
    } catch (err) {
        const error = new HttpError(
            "Something's not right... try again", 
            500
        )
        return next(error)
    }

    if (!userWithWalks || userWithWalks.walks.length === 0) {
        return next(new HttpError(
            'Could not find a walk for that user id...', 
            404)
        )       
    }
    // .find() returns an array, so use .map() to make each userWalk an object
    res.json({ walks: userWithWalks.walks.map(walk => walk.toObject({ 
    //getters: true removes the underscore in _id
    getters: true }) )})
}

const createWalk = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed. please check and try again', 422))
    }

    const { title, description, address, creator } = req.body

    let coordinates
    try {
        coordinates = await getCoordsForAddress(address)
    } catch (error) {
        return next(error)
    }
    
    const createdWalk = new Walk({
        title, 
        description, 
        address, 
        location: coordinates, 
        image: 'https://observer.case.edu/wp-content/uploads/2012/10/Ne_lakeview-BW.jpg', 
        creator  
    })
   
    //check if user id exists already
    let user

    try {
        user = await User.findById(creator)
    } catch (err) {
        const error = new HttpError(
            'Creating walk failed, please try again',
            500
        )
        return next(error)
    }
    
    if (!user) {
        const error = new HttpError(
            'Could not find user with that id',
            404
        )
        return next(error)
    }

   try {
        const sesh = await mongoose.startSession()
        sesh.startTransaction()       
        await createdWalk.save({ session: sesh })
        user.walks.push(createdWalk)
        await user.save({ session: sesh })
        await sesh.commitTransaction()
    } catch (err) {
        const error = new HttpError('Creating this walk failed, please try again', 500)
        return next(error)
    }    
    res.status(201).json({ walk: createdWalk})
}

const updateWalk = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed. please check and try again', 422))
    }

    const { title, description } = req.body
    const walkId = req.params.wid

    let walk
    try {
        walk = await Walk.findById(walkId)
    } catch (err) {
        const error = new HttpError(
            'Error updating...',
            500
        )
        return next(error)
    }

    walk.title = title
    walk.description = description

    try {
        await walk.save()
    } catch (err) {
        const error = new HttpError(
            "Something went wrong updating this walk",
            500
        )
        return next(error)
    }

    res.status(200).json({walk: walk.toObject({ getters: true }) })
}

const deleteWalk = async (req, res, next) => {
    const walkId = req.params.wid
    
    let walk
    try {
        walk = await Walk.findById(walkId).populate('creator')
    } catch (err) {
        const error = new HttpError(
            "Error deleting...",
           500 
        )
        return next(error)
    }

    if (!walk) {
        const error = new HttpError(
            'Could not find place with this id',
            404
        )
        return next(error)
    }

    try{
        const sesh = await mongoose.startSession()
        sesh.startTransaction()
        await walk.deleteOne({ session: sesh })
        walk.creator.walks.pull(walk)
        await walk.creator.save({ session: sesh })
        await sesh.commitTransaction()
    }catch (err) {
        const error = new HttpError(
            "Error deleting...",
           500 
        )
        return next(error)
    }

    res.status(200).json({ message: 'deleted that walk' })
}


exports.getWalkById = getWalkById
exports.getWalksByUserId = getWalksByUserId
exports.createWalk = createWalk
exports.updateWalk = updateWalk
exports.deleteWalk = deleteWalk