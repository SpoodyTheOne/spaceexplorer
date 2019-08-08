"use strict";

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 80;

var players = {};

app.engine("html", require("ejs").renderFile);
app.use(express.urlencoded());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/files/html/connect.html");
});

app.post("/", (req, res) => {
  res.render(__dirname + "/files/html/index.html", { name: req.body.name });
});

app.get("/script/:script", (req, res) => {
  res.sendFile(__dirname + "/files/js/" + req.params.script + ".js");
});

io.on("connection", socket => {
  players[socket.id] = {
    name: "connecting",
    id: socket.id,
    pos: { x: 0, y: 0 },
    dir: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    health: 100,
    cash: 100,
    minerals: {},
    color:
      "#" +
      (Math.round(Math.random() * (16777215 - 11184810)) + 11184810).toString(
        16
      )
  };

  socket.on("init", data => {
    players[socket.id].name = {
        name: data.name,
        id: socket.id,
        pos: { x: 0, y: 0 },
        dir: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        health: 100,
        cash: 100,
        minerals: {},
        color:
          "#" +
          (Math.round(Math.random() * (16777215 - 11184810)) + 11184810).toString(
            16
          )
      };
    io.emit("players", { players: players, new: players[socket.id] });
  });

  socket.on("players", () => {
    socket.emit("players", players);
  });

  socket.on("chat", data => {
    io.emit("chat", {
      id: socket.id,
      msg: data,
      color: players[socket.id].color
    });
  });

  socket.on("move", data => {
    io.emit("move", data);

    if (players[data.id]) players[data.id].pos = data.pos;
  });

  socket.on("disconnect", () => {
    io.emit("players", { players: players, old: players[socket.id] });
    delete players[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
