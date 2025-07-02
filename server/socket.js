let io = null;

function init(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*", // Consider locking this down in production
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId.toString()); // Join specific room
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      
      // Emit poll data if needed (optional)
      // e.g. io.to(roomId).emit("room-data", ...)
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { init, getIO };
