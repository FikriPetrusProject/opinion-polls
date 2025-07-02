require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const router = require("./routers/router");
const errorHandler = require("./middlewares/errorHandler");
const { init } = require("./socket"); // Your custom socket setup

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler); // Don't forget error handling middleware!

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
init(server); // ✅ Setup socket using your `init()` method

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
