const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
  addUser,
  removeUser,
  getUser,
  etUsersInRoom,
} = require("./utils/users.js");
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const {
  generateMessage,
  generateMessageLocation,
} = require("./utils/messages.js");

app.use(express.static(publicDirectoryPath));
io.on("connection", (socket) => {
  console.log("ur socket io is connected");

  socket.on("join", ({ username, room }, cb) => {
    const { error, user } = addUser({
      id: socket.id,
      username: username,
      room: room,
    });
    if (error) {
      cb(error);
    }
    socket.join(user.room);
    socket.emit("message", generateMessage(user.username, "Welcome!!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(` ${user.username} has joined!`));
  });
  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", generateMessage(user.username, message));
    cb();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left !`)
      );
    }
  });
  socket.on("sendLocation", (cords, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "showLocation",
      generateMessageLocation(
        user.username,
        `https://google.com/maps?q=${cords.laltitude},${cords.longitude}`
      )
    );
    cb();
  });
});

server.listen(port, () => {
  console.log("ur app running on " + port);
});
