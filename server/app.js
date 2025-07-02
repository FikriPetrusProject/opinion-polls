require("dotenv").config();
const express = require('express');
const cors = require("cors");
const http = require("http"); // ⬅️ import HTTP
const { Server } = require("socket.io"); // ⬅️ import socket.io

const app = express();
const router = require('./routers/router');
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

// 🔁 Create HTTP server from app
const server = http.createServer(app);

// 🔌 Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*", // for development; restrict in production, * for all btw
    }
});

// Optional: basic socket test
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// 🟢 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// ✅ Export io for use in controllers
module.exports = { io };
