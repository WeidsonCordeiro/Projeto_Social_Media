require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");
const router = require("./routes/Router.js");
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL_PRD,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL_PRD,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.some(
    (user) => user.userId.toString() === userId.toString()
  );

  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // usuário entrou
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    io.emit("getUsers", onlineUsers);

    console.log("ONLINE USERS:", onlineUsers);
  });

  // usuário saiu
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    removeUser(socket.id);

    io.emit("getUsers", onlineUsers);
  });
});

//Routes
app.use(router);

//Middleware de Tratamento de Erros Global:
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ errors: [err.message] });
});

// Connect to MongoDB and start the server
connectDB();

if (process.env.VERCEL) {
  module.exports = app;
} else {
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}
