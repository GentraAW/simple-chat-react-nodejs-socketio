const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "*" }));

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " joined chat");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " left chat");
  });
  socket.on("chat", function (username) {
    socket.broadcast.emit("chat", username);
  });
});

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io-client/dist/socket.io.js");
});

server.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
