"use strict"

const users = require('../models/users')
const products = require('../models/products')
const categories = require('../models/categories')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//Users
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

//Products
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

//Categories
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

//Cart
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

//Log-in/Sign-up
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

//Search
exports.getSearch = (req, res, next) => {

}