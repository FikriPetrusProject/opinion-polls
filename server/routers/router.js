const express = require('express');
const UserController = require('../controllers/userController');
const isLogin = require('../middlewares/authn');
const PollController = require('../controllers/pollController');
const VoteController = require('../controllers/voteController');
const router = express.Router();

router.post("/register", UserController.register)
router.post("/login", UserController.login)

router.get("/polls", isLogin, PollController.getAllPolls);
router.post("/polls/manual", isLogin, PollController.userCreatePoll)
router.post("/polls/ai", isLogin, PollController.geminiCreatePoll)

router.post("/polls/:id/vote", isLogin, VoteController.castVote)

module.exports = router