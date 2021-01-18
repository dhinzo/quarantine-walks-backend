const { validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')

const HttpError = require('../models/http-error')

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Devin',
        email: 'test@test.com',
        password: '1234'
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        
        throw new HttpError('Invalid login information. Try again')
    }

    const {name, email, password} = req.body

    const checkUser = DUMMY_USERS.find(u => u.email === email)
    if (checkUser) {
        throw new HttpError('account already exists. please try a different email', 422) 
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser)

    res.status(201).json({ user: createdUser})
}

const login = (req, res, next) => {
    const { email, password } = req.body
    
    const foundUser = DUMMY_USERS.find(u => u.email === email)
    if (!foundUser || foundUser.password !== password) {
        throw new HttpError('could not find this account. check your info and try again', 401)
    }
    res.json({message: 'logged in'})
}

exports.getUsers = getUsers
exports.login = login
exports.signup = signup