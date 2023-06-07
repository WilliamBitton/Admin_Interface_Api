"use strict"

const users = require('../models/users')
const categories = require('../models/categories')

exports.getCategories = (req, res, next) => {
    categories.find()
        .then(categories => {
            res.status(200).json({
                categories: categories
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.getCategoriesId = (req, res, next) => {
    const id = req.params.id
    categories.findById(id)
        .then(id => {
            res.status(200).json({
                id: id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.postCategories = (req, res, next) => {
    const { name } = req.body
    const user = req.user.userId
    users.findById(user)
        .then((user) => {
            if (user.isAdmin) {
                const newCategory = new categories({
                    name: name
                })
                newCategory.save()
                    .then((category) => {
                        res.status(201).json({
                            category: category
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
        })
}

exports.putCategoriesId = (req, res, next) => {
    const id = req.params.id
    const updatedCategory = req.body
    const user = req.user.userId
    users.findById(user)
        .then((user) => {
            if (user.isAdmin) {
                categories.findByIdAndUpdate(id, updatedCategory, { new: true })
                    .then((category) => {
                        res.status(200).json({
                            category: category,
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
        })
}

exports.deleteCategoriesId = (req, res, next) => {
    const id = req.params.id
    const user = req.user.userId
    users.findById(user)
        .then((user) => {
            if (user.isAdmin) {
                categories.findByIdAndRemove(id)
                    .then(_ => {
                        res.status(204).send()
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
        })
}