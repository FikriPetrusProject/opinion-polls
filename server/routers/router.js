const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
// Import routes

router.post("/register", UserController.register)
router.post("/login", UserController.login)

module.exports = router