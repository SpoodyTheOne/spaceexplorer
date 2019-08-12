var socket = io();

var players = {};
var localPlayer = {};

var chatting = false;

var emptyPlayer = {
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
    (Math.round(Math.random() * (16777215 - 11184810)) + 11184810).toString(16)
};

var frameCount = 0;
var fps = 0;

socket.emit("init", { name: socketName });

socket.on("players", data => {
  console.log(data.players);

  players = data.players;
  if (data.new != null)
    chat.push({
      id: null,
      msg: data.new.name + " joined the game",
      color: "#56e33d"
    });
  else {
    chat.push({
      id: null,
      msg: data.old.name + " left the game",
      color: "#e33d3d"
    });

    delete players[data.old.id];
  }

  if (chat.length > 16) {
    chat.splice(0, 1);
  }

  var vel = localPlayer.vel || { x: 0, y: 0 };
  var pos = localPlayer.pos || {x:0,y:0};

  localPlayer = players[socket.id];

  localPlayer.vel = vel || { x: 0, y: 0 };
  localPlayer.pos = pos;

  console.log(players[socket.id]);
});

socket.on("chat", data => {
  chat.push(data);
  if (chat.length > 16) {
    chat.splice(0, 1);
  }
});

socket.on("move", data => {
  if (typeof players[data.id] != "undefined" && data.id != localPlayer.id) players[data.id].pos = data.pos;
});

document.getElementById("chatprompt").onkeydown = e => {
  if (e.key == "ArrowUp" && historyIndex < chatHistory.length - 1) {
    historyIndex++;
  }
};

if (chatHistory.length > 0 && e.key == "ArrowUp") {
  $("#chatprompt").val(chatHistory[historyIndex]);
}

function postChat(msg) {
  socket.emit("chat", msg);
}

function update() {
  game();
  ui();
  frameCount++;
}

setInterval(update, (1 / 60) * 1000);

setInterval(() => {
  fps = frameCount;
  frameCount = 0;
}, 1000);
