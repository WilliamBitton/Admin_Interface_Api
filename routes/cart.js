"use strict";

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAuth = require('../middleware/is-auth');

router.get('/cart', isAuth, cartController.getCart)
router.put('/cart', isAuth, cartController.putCart)
router.delete('/cart/:id', isAuth, cartController.deleteCartId)

module.exports = router;