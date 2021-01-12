const express = require('express')

const router = express.Router()

const DUMMY_DATA = [
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
    },
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
    },
    {
        id: 'w1',
        title: 'Lakeview Cemetery',
        description: 'Where all my friends are',
        location: {
            lat: 41.5138354,
            lng: -81.5983687
        },
        address: '12316 Euclid Ave, Cleveland, OH 44106',
        creator: 'u2'
    }
]

router.get('/:wid', (req, res, next) => {
    const walkId = req.params.wid
    const walk = DUMMY_DATA.find(w => {
        return w.id === walkId
    })
    if (!walk) {
        const error = new Error('Could not find a walk for that id...')
        error.code = 404
        throw error
    }
    res.json({walk})
})

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid
    const userWalk = DUMMY_DATA.find(u => {
        return u.creator === userId
    })
    if (!userWalk) {
        if (!walk) {
            const error = new Error('Could not find a walk for that user id...')
            error.code = 404
            return next(error)
        }
    }
    res.json({userWalks})
})

module.exports = router