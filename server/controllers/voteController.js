const { Vote, Poll, Option } = require("../models");
const { getIO } = require("../socket");

class VoteController {
  static async castVote(req, res, next) {
    try {
      const { id: pollId } = req.params;
      const { optionId } = req.body;
      const userId = req.user.id;

      const poll = await Poll.findByPk(pollId);
      if (!poll) throw new Error("POLL_NOT_FOUND");

      const option = await Option.findOne({ where: { id: optionId, Poll_Id: pollId } });
      if (!option) throw new Error("OPTION_NOT_FOUND");

      const existingVote = await Vote.findOne({ where: { User_Id: userId, Poll_Id: pollId } });
      if (existingVote) throw new Error("ALREADY_VOTED");

            const vote = await Vote.create({
                User_Id: userId,
                Poll_Id: pollId,
                Option_Id: optionId
            });

            // Real-time update part
            const io = getIO();
            io.emit("vote-update", {
                pollId,
                optionId,
                userId
            });

            return res.status(201).json({
                message: "Vote submitted successfully",
                vote
            });

        } catch (err) {
            if (err.name === "SequelizeUniqueConstraintError") {
                err.message = "ALREADY_VOTED";
            }
            next(err);
        }
    }
}

module.exports = VoteController;
