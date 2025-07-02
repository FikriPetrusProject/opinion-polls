npx sequelize-cli seed:generate --name users
npx sequelize-cli seed:generate --name polls
npx sequelize-cli seed:generate --name options
npx sequelize-cli seed:generate --name votes

[USERS]
const options = require("../data/options.json");

polls.forEach((el) => {
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(el.password, salt);
    el.password = hash;
    el.createdAt = new Date();
    el.updatedAt = new Date();
});
    await queryInterface.bulkInsert("Users", polls, {});
.........
    await queryInterface.bulkDelete("Users", null, {});


[POLLS]
const polls = require("../data/polls.json");

polls.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
});
    await queryInterface.bulkInsert("Polls", polls, {});


    await queryInterface.bulkDelete("Polls", null, {});


[OPTIONS]
const options = require("../data/options.json");

options.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
});
    await queryInterface.bulkInsert("Options", options, {});


    await queryInterface.bulkDelete("Options", null, {});



[VOTES]
const votes = require("../data/votes.json");

votes.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
});
    await queryInterface.bulkInsert("Votes", votes, {});


    await queryInterface.bulkDelete("Votes", null, {});
