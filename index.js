const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
/* Loads all variables from .env file to "process.env" */
require("dotenv").config();
const db = require("./config/database");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

db.authenticate()
  .then(() => console.log("db connect success"))
  .catch(err => console.log("db connect failed"));

const publicDirectoryPath = path.join(__dirname, "/public");

app.use(express.static(publicDirectoryPath));
app.use(express.json());

app.use("/users", require("./routes/users"));

io.on("connection", socket => {
  console.log("New websocket connection");
  //emit to this connection
  socket.emit("message", "welcome");

  //only difference between io.emit and socket.broadcast.emit is socket.broadcast.emit emitds event to all connected user except for itself
  socket.broadcast.emit("message", "A new User joined!");
  socket.on("sendMessage", (m, cb) => {
    io.emit("message", m);
    cb("server has processed your message");
  });
  socket.on("sendLocation", coords => {
    socket.broadcast.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
  });
  socket.on("disconnect", () => {
    io.emit("message", "a user has left");
  });
});

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
