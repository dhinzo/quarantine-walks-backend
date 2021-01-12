const express = require('express')
const bodyParser = require('body-parser')

const walkRoutes = require('./routes/walks-routes')

const app = express()

app.use('/api/walks', walkRoutes)

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred...'})
})

app.listen(5000, () => {
    console.log('Listening for requests...')
})