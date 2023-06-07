"use strict"

const users = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body
    let user
    users.findOne({ email })
        .then((userFound) => {
            if (!userFound) {
                const error = new Error('User not found')
                error.statusCode = 404
                throw error
            }
            user = userFound
            return bcrypt.compare(password, user.password)
        })
        .then(valid => {
            if (!valid) {
                const error = new Error('Wrong password !')
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign(
                {
                    email: user.email,
                    name: user.name,
                    userId: user._id.toString()
                },
                process.env.SECRET_JWT,
                { expiresIn: '1h' }
            )
            res.status(200).json({ token: token })
        })
        .catch(err => {
            next(err)
        })
}

exports.postSignup = (req, res, next) => {
    const { firstname, lastname, email, city, password } = req.body
    users.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(409).json({ error: 'Email already exists' })
            }
            bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    const newUser = new users({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        city: city,
                        password: hashedPassword,
                        isAdmin: false,
                        cart: [],
                    })
                    return newUser.save()
                })
                .then((createdUser) => {
                    res.status(201).json({
                        message: 'User created successfully',
                        userId: createdUser.id,
                    })
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500
                    }
                    next(err)
                })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}