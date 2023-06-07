"use strict";

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const isAuth = require('../middleware/is-auth');

router.get('/users', usersController.getUsers)
router.get('/users/profile', isAuth, usersController.getUsersProfile)
router.get('/users/:id', usersController.getUsersId)
router.put('/users/:id', isAuth, usersController.putUsersId)
router.delete('/users/:id', isAuth, usersController.deleteUsersId)

module.exports = router;