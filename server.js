const express = require('express')
const bodyParser = require('body-parser')

const walkRoutes = require('./routes/walks-routes')

const app = express()

app.use(walkRoutes)

app.listen(5000, () => {
    console.log('Listening for requests...')
})