const express = require('express');
const UserController = require('../controllers/userController');
const isLogin = require('../middlewares/authn');
const PollController = require('../controllers/pollController');
const router = express.Router();

router.post("/register", UserController.register)
router.post("/login", UserController.login)

router.post("/polls/manual", isLogin, PollController.userCreatePoll)
router.post("/polls/ai", isLogin, PollController.geminiCreatePoll)

module.exports = router