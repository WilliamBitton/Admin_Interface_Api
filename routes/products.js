"use strict";

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const isAuth = require('../middleware/is-auth');

router.get('/products', productsController.getProducts)
router.get('/products/:id', productsController.getProductsId)
router.post('/products', /* isAuth, */ productsController.postProducts)
router.delete('/products/:id', /* isAuth, */ productsController.deleteProductsId)
router.get('/products/user/:userId', productsController.getProductsUserUserId)
router.get('/search', productsController.getSearch)

module.exports = router;