const { pollTopic, summarizePoll } = require("../helpers/gemini");
const { Poll, Option } = require("../models");
const { getIO } = require("../socket");

const activeRooms = {}; // make sure this is declared somewhere shared

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

            await Option.bulkCreate(optionsRecord);

            const io = getIO();
            io.emit("poll-created", {
                id: poll.id,
                question: poll.question,
                options, // raw strings
                creator: user.username || user.email, // optional
            });

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

            // Real-time emit
            io.emit("poll-created", {
                id: poll.id,
                question,
                options,
                creator: user.username || user.email,
            });

            // Optional: room-style logic (delete if unused)
            activeRooms[poll.id] = {
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
}

module.exports = PollController;
