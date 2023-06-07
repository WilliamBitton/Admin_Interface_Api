"use strict"

const users = require('../models/users')
const products = require('../models/products')

exports.getCart = (req, res, next) => {
    const user = req.user.userId
    users.findById(user)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            const cart = user.cart
            res.status(200).json({ cart })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.putCart = (req, res, next) => {
    const user = req.user.userId
    const productId = req.body.productId
    Promise.all([
        users.findById(user),
        products.findById(productId)
    ])
        .then(([user, product]) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            if (!product) {
                return res.status(404).json({ error: 'Product not found' })
            }
            if (product.isSold) {
                return res.status(400).json({ error: 'Product is already sold' })
            }
            user.cart.push(productId)
            user.save()
            product.isSold = true
            return product.save()
        })
        .then(() => {
            res.status(200).json({ message: 'Product added to cart successfully' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.deleteCartId = (req, res, next) => {
    const user = req.user.userId
    const productId = req.params.id
    users.findById(user)
        .then(user => {
            if (!user) {
                res.status(404).json({ error: 'User not found' })
            }
            const productIndex = user.cart.indexOf(productId)
            if (productIndex !== -1) {
                user.cart.splice(productIndex, 1)
            }
            return user.save()
        })
        .then(() => {
            return products.findById(productId)
        })
        .then(product => {
            if (product) {
                product.isSold = false
                return product.save()
            }
        })
        .then(() => {
            res.status(200).json({ message: 'Product removed from cart successfully' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}