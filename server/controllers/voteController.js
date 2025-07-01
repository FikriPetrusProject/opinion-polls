const { Vote, Poll, Option } = require("../models");

class VoteController {

    static async castVote(req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }

}

module.exports = VoteController