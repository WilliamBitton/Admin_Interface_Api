"use strict";

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const isAuth = require('../middleware/is-auth');

//Users
router.get('/users', indexController.getUsers)
router.get('/users/profile', isAuth, indexController.getUsersProfile)
router.get('/users/:id', indexController.getUsersId)
router.put('/users/:id', isAuth, indexController.putUsersId)
router.delete('/users/:id', isAuth, indexController.deleteUsersId)

//Products
router.get('/products', indexController.getProducts)
router.get('/products/:id', indexController.getProductsId)
router.post('/products', isAuth, indexController.postProducts)
router.delete('/products/:id', isAuth, indexController.deleteProductsId)
router.get('/products/user/:userId', indexController.getProductsUserUserId)

//Categories
router.get('/categories', indexController.getCategories)
router.get('/categories/:id', indexController.getCategoriesId)
router.post('/categories', isAuth, indexController.postCategories)
router.put('/categories/:id', isAuth, indexController.putCategoriesId)
router.delete('/categories/:id', isAuth, indexController.deleteCategoriesId)

//Cart
router.get('/cart', isAuth, indexController.getCart)
router.put('/cart', isAuth, indexController.putCart)
router.delete('/cart/:id', isAuth, indexController.deleteCartId)

//Log-in/Sign-up
router.post('/login', indexController.postLogin)
router.post('/signup', indexController.postSignup)

//Search
router.get('/search', indexController.getSearch)

module.exports = router;