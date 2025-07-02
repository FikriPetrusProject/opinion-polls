const { pollTopic, summarizePoll } = require("../helpers/gemini");
const { Poll, Option, Vote } = require("../models");
const { getIO } = require("../socket");

const activeRooms = {}; // shared room tracking object

class PollController {
  static async userCreatePoll(req, res, next) {
    try {
      const { question, options } = req.body;
      const user = req.user;

      if (!question || !Array.isArray(options) || options.length < 2) {
        throw new Error("INVALID_INPUT");
      }

      const poll = await Poll.create({
        question,
        User_Id: user.id,
      });

      const optionsRecord = options.map((choice) => ({
        Poll_Id: poll.id,
        text: choice,
      }));

      const insertedOptions = await Option.bulkCreate(optionsRecord, {
        returning: true,
      });

      const io = getIO();
      const payload = {
        pollId: poll.id,
        question: poll.question,
        options: insertedOptions.map((opt) => ({ id: opt.id, text: opt.text })),
      };
      io.emit("room-data", payload);

      const summary = await summarizePoll(question, options);

      res.status(201).json({
        message: "Poll created by user",
        pollId: poll.id,
        question,
        options,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async geminiCreatePoll(req, res, next) {
    try {
      const { topic, choice } = req.body;
      const user = req.user;

      if (!topic) throw new Error("INVALID_INPUT");
      const inputChoice = choice || 4;
      if (inputChoice < 2) throw new Error("INVALID_INPUT");

      const options = await pollTopic(topic, inputChoice);
      const question = `What is your opinion on ${topic}?`;

      const poll = await Poll.create({ question, User_Id: user.id });
      const optionsRecords = options.map((text) => ({
        Poll_Id: poll.id,
        text,
      }));

      const insertedOptions = await Option.bulkCreate(optionsRecords, {
        returning: true,
      });

      const io = getIO();
      const payload = {
        pollId: poll.id,
        question,
        options: insertedOptions.map((opt) => ({ id: opt.id, text: opt.text })),
      };
      io.emit("room-data", payload);

      const summary = await summarizePoll(question, options);

      res.status(201).json({
        message: "Poll created with AI help",
        pollId: poll.id,
        question,
        options,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPolls(req, res, next) {
    try {
      const polls = await Poll.findAll({
        include: [{ model: Option }],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(polls);
    } catch (error) {
      next(error);
    }
  }

  // ✅ New: Get detailed poll info with votes + user’s choice
  static async getPollDetails(req, res, next) {
    try {
      const pollId = req.params.id;
      const userId = req.user.id;

      const poll = await Poll.findByPk(pollId, {
        include: [{ model: Option }],
      });
      if (!poll) throw new Error("POLL_NOT_FOUND");

      const userVote = await Vote.findOne({
        where: { Poll_Id: pollId, User_Id: userId },
      });

      const options = await Promise.all(
        poll.Options.map(async (opt) => {
          const count = await Vote.count({ where: { Option_Id: opt.id } });
          return {
            id: opt.id,
            text: opt.text,
            votes: count,
          };
        })
      );

      res.status(200).json({
        question: poll.question,
        options,
        userVoteOptionId: userVote?.Option_Id || null,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PollController;
