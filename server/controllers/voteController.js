const { Vote, Poll, Option } = require("../models");
const { getIO } = require("../socket");

class VoteController {
  static async castVote(req, res, next) {
    try {
      const { id: pollId } = req.params;
      const { optionId } = req.body;
      const userId = req.user.id;

      // Check if poll exists
      const poll = await Poll.findByPk(pollId);
      if (!poll) throw new Error("POLL_NOT_FOUND");

      // Check if option is valid for this poll
      const option = await Option.findOne({ where: { id: optionId, Poll_Id: pollId } });
      if (!option) throw new Error("OPTION_NOT_FOUND");

      // Check if user already voted
      const existingVote = await Vote.findOne({
        where: { User_Id: userId, Poll_Id: pollId },
      });
      if (existingVote) throw new Error("ALREADY_VOTED");

      // Create the vote
      const vote = await Vote.create({
        User_Id: userId,
        Poll_Id: pollId,
        Option_Id: optionId,
      });

      // Emit vote update to the specific poll room only
      const io = getIO();
      io.to(pollId.toString()).emit("vote-update", {
        optionId,
      });

      return res.status(201).json({
        message: "Vote submitted successfully",
        vote,
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
