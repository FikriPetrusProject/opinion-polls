require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();

const router = require("./routers/router");
const errorHandler = require("./middlewares/errorHandler");
const { init } = require("./socket"); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const server = http.createServer(app);

init(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
