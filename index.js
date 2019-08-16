"use strict";

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 80;

var players = {};

app.engine("html", require("ejs").renderFile);
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.render(__dirname + "/files/html/connect.html",{online:Object.keys(players).length});
});

app.post("/", (req, res) => {
  res.render(__dirname + "/files/html/index.html", {
    name: req.body.name,
    color: req.body.color
  });
});

app.get("/script/:script", (req, res) => {
  res.sendFile(__dirname + "/files/js/" + req.params.script + ".js");
});

app.get("/image/:img", (req, res) => {
  res.sendFile(__dirname + "/files/images/" + req.params.img + ".png");
})

app.get("/mp3/:img", (req, res) => {
  res.sendFile(__dirname + "/files/mp3/" + req.params.img + ".mp3");
})


io.on("connection", socket => {

  console.log("Connection");

  players[socket.id] = {
    name: "connecting",
    id: socket.id,
    pos: {
      x: 0,
      y: -50
    },
    dir: {
      x: 0,
      y: 0
    },
    vel: {
      x: 0,
      y: 0
    },
    fuel:2000,
    maxFuel:2000,
    keys: {},
    ang: 0,
    angvel: 0,
    health: 100,
    maxHealth:100,
    cash: 100,
    minerals: {},
    mass: 5,
    color: "#" +
      (Math.round(Math.random() * (16777215 - 11184810)) + 11184810).toString(
        16
      ),
    body: null
  };

  socket.on("init", data => {
    players[socket.id].name = data.name;
    players[socket.id].color = data.color == "" ? players[socket.id].color : data.color;
    io.emit("players", {
      players: players,
      new: players[socket.id]
    });
    console.log("Initializing " + data.name);
    console.log(players);
  });

  socket.on("players", () => {
    socket.emit("players", players);
    console.log("sending players to " + players[socket.id].name);
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

    if (typeof players[data.id] != "undefined" && players[data.id].body != null) {
      players[data.id].pos = data.pos;
      players[data.id].ang = data.ang;
      players[data.id].angvel = data.angvel;

      players[data.id].keys = data.keys;
    }
  });

  socket.on("body", data => {
    players[socket.id].body = data.body;
  })

  socket.on("disconnect", () => {
    io.emit("players", {
      players: players,
      old: players[socket.id]
    });
    console.log("Player left " + players[socket.id].name)
    delete players[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});