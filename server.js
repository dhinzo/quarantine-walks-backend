const express = require('express')
const bodyParser = require('body-parser')

const walkRoutes = require('./routes/walks-routes')
const usersRoutes = require('./routes/users-routes')

const HttpError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use('/api/walks', walkRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    const error = new HttpError('could not find this route :(', 404)
    throw error
})

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