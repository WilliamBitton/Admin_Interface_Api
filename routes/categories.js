"use strict";

const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const isAuth = require('../middleware/is-auth');

router.get('/categories', categoriesController.getCategories)
router.get('/categories/:id', categoriesController.getCategoriesId)
router.post('/categories', isAuth, categoriesController.postCategories)
router.put('/categories/:id', isAuth, categoriesController.putCategoriesId)
router.delete('/categories/:id', isAuth, categoriesController.deleteCategoriesId)

module.exports = router;