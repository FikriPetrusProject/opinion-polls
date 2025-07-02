const { pollTopic, summarizePoll } = require("../helpers/gemini");
const { Poll, Option } = require("../models");
const { io } = require("../app"); // make sure io is exported from app.js

const activeRooms = {}; // pollId: { timer, pollId, question, options }

class PollController {
  static async userCreatePoll(req, res, next) {
    try {
      let { question, options } = req.body;
      let user = req.user;

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

      await Option.bulkCreate(optionsRecord);

      const summary = await summarizePoll(question, options);

      res.status(201).json({
        message: "Poll created by user",
        pollId: poll.id,
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
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(polls);
  } catch (error) {
    next(error);
  }
}

  static async geminiCreatePoll(req, res, next) {
    try {
      const { topic, choice } = req.body;
      let user = req.user;

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

      // Send data to socket room
      const payload = {
        pollId: poll.id,
        question,
        options: insertedOptions.map((opt) => ({ id: opt.id, text: opt.text })),
      };
      io.emit("room-data", payload);

      // Setup 60s room timer
      if (activeRooms[poll.id]) clearTimeout(activeRooms[poll.id].timer);
      activeRooms[poll.id] = {
        pollId: poll.id,
        question,
        options: insertedOptions,
        timer: setTimeout(async () => {
          const summary = await summarizePoll(question, options);
          io.emit("room-ended", summary);
          delete activeRooms[poll.id];
        }, 60000),
      };

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
}

module.exports = PollController;
