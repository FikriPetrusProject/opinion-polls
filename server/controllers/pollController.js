const { text } = require("body-parser")
const { pollTopic, summarizePoll } = require("../helpers/gemini")
const { Poll, Option } = require("../models")

class PollController {

    static async userCreatePoll(req, res, next) {
        try {
            let { question, options } = req.body
            let user = req.user

            if (!question || !Array.isArray(options) || options.length < 2) {
                throw new Error("INVALID_INPUT")
            }

            const poll = await Poll.create({
                question,
                "User_Id": user.id
            })

            const optionsRecord = options.map(choice => ({
                Poll_Id: poll.id,
                text: choice
            }));

            await Option.bulkCreate(optionsRecord)

            const summary = await summarizePoll(question, options)

            res.status(201).json({
                message: "Poll created by user",
                pollId: poll.id,
                summary
            })
        } catch (error) {
            next(error)
        }
    }

    static async geminiCreatePoll(req, res, next) {
        try {
            const { topic, choice } = req.body
            let user = req.user

            if (!topic) throw new Error("INVALID_INPUT")

            const inputChoice = choice || 4

            if (inputChoice < 2) throw new Error("INVALID_INPUT")

            let options = await pollTopic(topic, inputChoice)

            let question = `
             What is your opinion on ${topic}`

            const poll = await Poll.create({
                question,
                User_Id: user.id,
            })

            const optionsRecords = options.map(answers => ({
                Poll_Id: poll.id,
                text: answers
            }))

            await Option.bulkCreate(optionsRecords)

            const summary = await summarizePoll(question, options)

            res.status(201).json({
                message: "Poll created with AI help",
                pollId: poll.id,
                question,
                options,
                summary
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = PollController