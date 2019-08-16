var socket = io();

var players = {};
var localPlayer = {};

var chatting = false;

var totalFrames = 0;

var emptyPlayer = {
  name: "connecting",
  id: socket.id,
  pos: {
    x: 0,
    y: 0
  },
  dir: {
    x: 0,
    y: 0
  },
  vel: {
    x: 0,
    y: 0
  },
  health: 100,
  cash: 100,
  minerals: {},
  color: "#" +
    (Math.round(Math.random() * (16777215 - 11184810)) + 11184810).toString(16)
};

var frameCount = 0;
var fps = 0;

socket.emit("init", {
  name: socketName,
  color: socketColor
});

socket.on("players", data => {
  //console.log(data.players);

  Object.keys(players).forEach(id => {
    var player = players[id];
    if (player.body != null)
      world.destroyBody(player.body);
  })

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

    chat.forEach(c => {
      if (c.id === data.old.id) {
        c.id = data.old.name;
      }
    })

    delete players[data.old.id];
  }

  if (chat.length > 16) {
    chat.splice(0, 1);
  }

  var vel = localPlayer.vel || {
    x: 0,
    y: 0
  };
  var pos = localPlayer.pos || {
    x: 0,
    y: -50
  };

  localPlayer = players[socket.id];

  localPlayer.vel = vel || {
    x: 0,
    y: 0
  };
  localPlayer.pos = pos;

  Object.keys(players).forEach(id => {
    var player = players[id];

    if (!player.body && player.name != "connecting") {
      player.body = world.createBody({
        type: "dynamic",
        position: planck.Vec2(0, 0)
      });

      player.body.createFixture({
        shape: planck.Box(12, 20, planck.Vec2(0, 0), 0)
      });

      player.body.setPosition(planck.Vec2(player.pos.x, player.pos.y));
      player.body.setAngle(player.ang);

      player.body.setMassData({
        mass: 2,
        center: planck.Vec2(),
        I: 1
      })

      player.body.setAngularVelocity(player.angvel);
      player.body.setLinearVelocity(planck.Vec2(player.vel.x, player.vel.y));

      player.body.setAngularDamping(1.1);

      player.body.m_awakeFlag = true;
      player.body.m_autoSleepFlag = false

      player.body.isPlayerBody = player;
    }
  })

  //console.log(players[socket.id]);
});

socket.on("chat", data => {
  chat.push(data);
  if (chat.length > 16) {
    chat.splice(0, 1);
  }
});

socket.on("move", data => {
  if (typeof players[data.id] != "undefined" && data.id != localPlayer.id) {
    if (Vector.distance(players[data.id].body.c_position.c, data.pos) > 20)
      players[data.id].body.setPosition(data.pos)

    players[data.id].body.setLinearVelocity(data.vel);
    players[data.id].body.setAngle(data.ang);
    players[data.id].body.setAngularVelocity(data.angvel);

    players[data.id].keys = data.keys;

    //players[data.id].ang = data.ang;
  };

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
  totalFrames++;
}

setInterval(update, (1 / 60) * 1000);

setInterval(() => {
  fps = frameCount;
  frameCount = 0;
}, 1000);