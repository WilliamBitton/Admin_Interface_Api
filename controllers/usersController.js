"use strict"

const users = require('../models/users')

exports.getUsers = (req, res, next) => {
    users.find()
        .then(users => {
            res.status(200).json({
                users: users
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.getUsersId = (req, res, next) => {
    const id = req.params.id
    users.findById(id).select('-email -password')
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: 'User not found' })
            }
            res.status(200).json({ user })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.getUsersProfile = (req, res, next) => {
    const user = req.user.userId
    users.findById(user)
        .then((user) => {
            res.status(200).json({
                user: user,
            })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.putUsersId = (req, res, next) => {
    const id = req.params.id
    const user = req.user.userId
    if (id === user) {
        const updatedUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            city: req.body.city,
        }
        users.findByIdAndUpdate(id, updatedUser, { new: true })
            .then((user) => {
                res.status(200).json({
                    user: user,
                })
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    } else {
        res.status(403).json('Unauthorized')
    }
}

exports.deleteUsersId = (req, res, next) => {
    const user = req.user.userId
    const id = req.params.id
    if (id === user) {
        users.findByIdAndRemove(user)
            .then(() => {
                res.status(204).send()
            })
            .catch((err) => {
                next(err)
            })
    } else {
        res.status(403).json('Unauthorized')
    }
}