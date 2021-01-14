const { v4: uuidv4 } = require('uuid')

const HttpError = require('../models/http-error')

let DUMMY_DATA = [
    {
        id: 'w1',
        title: 'Lakeview Cemetery',
        description: 'Where all my friends are',
        location: {
            lat: 41.5138354,
            lng: -81.5983687
        },
        address: '12316 Euclid Ave, Cleveland, OH 44106',
        creator: 'u1'
    }
]

const getWalkById = (req, res, next) => {
    const walkId = req.params.wid
    const walk = DUMMY_DATA.find(w => {
        return w.id === walkId
    })
    if (!walk) {
        throw error = new HttpError('Could not find a walk with that id...', 404)        
    }
    res.json({walk})
}

const getWalksByUserId = (req, res, next) => {
    const userId = req.params.uid
    const userWalks = DUMMY_DATA.filter(u => {
        return u.creator === userId
    })
    if (!userWalks || userWalks.length === 0) {
        throw error = new HttpError('Could not find a walk for that user id...', 404)       
    }
    res.json({userWalks})
}

const createWalk = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body
    
    const createdWalk = {
        id: uuidv4(),
        title: title,
        description: description,
        location: coordinates,
        address: address,
        creator: creator
    }
    
    DUMMY_DATA.push(createdWalk)
    
    res.status(201).json({ walk: createdWalk})
}

const updateWalk = (req, res, next) => {
    const { title, description } = req.body
    const walkId = req.params.wid

    const updatedWalk = { ...DUMMY_DATA.find(w => w.id === walkId)}
    const walkIndex = DUMMY_DATA.findIndex(w => w.id === walkId)
    updatedWalk.title = title
    updatedWalk.description = description

    DUMMY_DATA[walkIndex] = updatedWalk

    res.status(200).json({walk: updatedWalk})
}

const deleteWalk = (req, res, next) => {
    const walkId = req.params.wid
    DUMMY_DATA = DUMMY_DATA.filter(w => w.id !== walkId)
    res.status(200).json({ message: 'deleted that walk' })
}


exports.getWalkById = getWalkById
exports.getWalksByUserId = getWalksByUserId
exports.createWalk = createWalk
exports.updateWalk = updateWalk
exports.deleteWalk = deleteWalk