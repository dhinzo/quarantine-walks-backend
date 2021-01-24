const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')


const getUsers = async (req, res, next) => {
    let users
    try{
    users = await User.find({}, '-password')
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed... try again later.',
            500
        )
        return next(error)
    }
    res.json({users: users.map(u => u.toObject({ getters: true }) )})
}

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {        
        return next(new HttpError('That email is already registered. Please login.', 422))
    }

    const { name, email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Sign up failed. Try again later!',
            500
        )
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError(
            'That email is already registered. Please login.',
            422
        )
        return next(error)
    }

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password,
        walks: [] 
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError('Creating this user failed, please try again', 500)
        return next(error)
    }    
    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}


const login = async (req, res, next) => {
    const { email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        console.log("here is the login route catch")
        const error = new HttpError(
            'Login failed. Try again!',
            500
        )
        return next(error)
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            "You entered some invalid credentials... please try again.",
            401
        )
        return next(error)
    }
    
    res.json({
        message: 'logged in',
        user: existingUser.toObject({ getters: true })})
}

exports.getUsers = getUsers
exports.login = login
exports.signup = signup