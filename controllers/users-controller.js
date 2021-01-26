const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

    let hashedPassword
    try {
        // second arg in hash() is salt. determines how strong hashed pw is
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError('Could not create account. Please try again.', 500)
        return next(error)
    }
    

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        walks: [] 
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError('Creating this user failed, please try again', 500)
        return next(error)
    }
    
    let token
    try {
        // assigning token to specific user via userId
        token = jwt.sign({ 
            userId: createdUser.id, email: createdUser.email }, 
            process.env.JWT_KEY,
            { expiresIn: '1h' }
            )
    } catch (err) {
        const error = new HttpError('Creating this user failed, please try again', 500)
        return next(error)
    }
    
    
    res
    .status(201)
    .json({ user: createdUser.id, email: createdUser.email, token: token })
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



    if (!existingUser) {
        const error = new HttpError(
            "You entered some invalid credentials... please try again.",
            401
        )
        return next(error)
    }

    let isValidPassword = false
    try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError(
            'Could not log in. Check your credentials and try again.',
            500
        )
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError(
            "You entered some invalid credentials... please try again.",
            403
        )
        return next(error)
    }

    let token
    try {
        // assigning token to specific user via userId
        token = jwt.sign({ 
            userId: existingUser.id, email: existingUser.email }, 
            process.env.JWT_KEY,
            { expiresIn: '1h' }
            )
    } catch (err) {
        const error = new HttpError('Login failed, please try again.', 500)
        return next(error)
    }
    
    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token })
}

exports.getUsers = getUsers
exports.login = login
exports.signup = signup