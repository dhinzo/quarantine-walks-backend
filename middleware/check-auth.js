const HttpError = require("../models/http-error")
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // token is stored in Authorization: 'Bearer TOKEN'
        if (!token) {
           throw new Error('Authentication failed') 
        }
        // validate token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        // add data to request
        req.userData = { userId: decodedToken.userId }
        next()
    } catch (err) {
        const error = new HttpError('Authentication failed', 403)
        return next(error)
    }
}