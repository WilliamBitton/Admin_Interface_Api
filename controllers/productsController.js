"use strict"

const products = require('../models/products')

exports.getProducts = (req, res, next) => {
  products.find()
    .then(products => {
      res.status(200).json({
        products: products
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getProductsId = (req, res, next) => {
  const productId = req.params.id
  products.findById(productId)
    .then(product => {
      if (!product) {
        res.status(404).send()
      }
      res.status(200).json({
        product: product
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.postProducts = (req, res, next) => {
  const { title, description, price, imageUrl, categoryId } = req.body
  const newProduct = new products({
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl,
    categoryId: categoryId,
    userId: req.user.userId,
    isSold: false
  })
  newProduct.save(newProduct)
    .then((product) => {
      res.status(201).json({
        product: product,
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.deleteProductsId = (req, res, next) => {
  const productId = req.params.id
  const user = req.user.userId
  products.findById(productId)
    .then((product) => {
      if (product.userId.toString() === user) {
        products.findByIdAndRemove(productId)
          .then(_ => {
            res.status(204).send()
          })
          .catch(err => {
            next(err)
          })
      } else {
        res.status(403).json('Unauthorized')
      }
    })
}

exports.getProductsUserUserId = (req, res, next) => {
  const userId = req.params.userId
  products.find({ userId: userId })
    .then((products) => {
      res.status(200).json({
        products: products
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getSearch = (req, res, next) => {

}