//#region game

var planet = new Planet(2000, 0, 1000, 100000, 5);

var world = planck.World({
  gravity: planck.Vec2(0, -10)
});

var ground = world.createBody({
  type: "static",
  position: planck.Vec2(2, 5),
});

ground.createFixture({
  shape: planck.Box(50, 5, planck.Vec2(0, 0), 0)
});

function game() {
  Camera.moveTo(
    Vector.add(
      Camera.position,
      Vector.div(Vector.sub(localPlayer.pos, Camera.position), { x: 2, y: 2 })
    )
  );

  //world.step(1 / 60);

  var groundPos = ground.getPosition();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //star background

  ctx.fillStyle = "#000000";

  planet.draw();

  Object.keys(players).forEach(id => {
    var player = players[id];
    if (player != localPlayer) {
      ctx.fillStyle = player.color;
      var camPos = Camera.toCamPos(player.pos);
      ctx.fillRect(camPos.x - 10, camPos.y - 10, 20, 20);
    }
  });
  if (typeof localPlayer.pos != "undefined") {
    ctx.fillStyle = localPlayer.color;
    var camPos = Camera.toCamPos(localPlayer.pos);
    ctx.fillRect(camPos.x - 10, camPos.y - 10, 20, 20);

    var dir = { x: 0, y: 0 };
    if (!chatting) {
      if (keys["w"]) dir.y -= 1;
      if (keys["s"]) dir.y += 1;
      if (keys["a"]) dir.x -= 1;
      if (keys["d"]) dir.x += 1;
    }

    var pos = {
      x: localPlayer.pos.x + localPlayer.vel.x,
      y: localPlayer.pos.y + localPlayer.vel.y
    };

    socket.emit("move", {
      id: localPlayer.id,
      pos: pos
    });

    localPlayer.pos = pos;

    if (Vector.magnitude(localPlayer.vel) <= 120) {
      localPlayer.vel.x += dir.x;
      localPlayer.vel.y += dir.y;
    } else {
      localPlayer.vel = Vector.mult(Vector.normalized(localPlayer.vel),{x:120,y:120});
    }

    planet.attract(localPlayer);

    //localPlayer.vel.x /= 1.15;
    //localPlayer.vel.y /= 1.15;
  }
  ctx.fillStyle = "#ff0000";

  ctx.beginPath();
  for (
    var fixture = ground.getFixtureList();
    fixture;
    fixture = fixture.getNext()
  ) {
    var vertex = fixture.m_shape.m_vertices;
    var pv;
    vertex.forEach((v, i) => {
      var pos = Camera.toCamPos(v);
      if (i == 0) {
        ctx.moveTo(pos.x, pos.y);
      } else if (i != vertex.length - 1) {
        ctx.lineTo(pos.x, pos.y);
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
        ctx.moveTo(pos.x, pos.y);

        var g = Camera.toCamPos(vertex[0]);
        ctx.lineTo(g.x, g.y);
      }
    });
  }

  ctx.stroke();
}
//#endregion

//#region ui

var chat = [
  {
    id: null,
    msg: "Welcome to space explorer! press ENTER to start chatting!",
    color: "#fcba03"
  }
];

var chatHistory = [];

var historyIndex = 0;

var advancedStats = false;
function ui() {
  //#region chat
  ctx.fillStyle = "#000000aa";
  ctx.fillRect(20, canvas.height - 270, 500, 250);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.font = "13px Arial";

  chat.forEach((chat, i) => {
    var msg = "";
    if (chat.id == null) {
      msg = chat.msg;
    } else if (typeof players[chat.id] != "undefined") {
      msg = players[chat.id].name + ": " + chat.msg;
    } else {
      msg = chat.id + ": " + chat.msg;
    }

    if (ctx.measureText(msg) > 200) {
    }
    ctx.fillStyle = chat.color;

    ctx.fillText(msg, 25, canvas.height - 265 + 15 * i);
  });
  //#endregion

  if (advancedStats) {
    ctx.fillText("fps:" + fps, 0, 0);
  }
}
//#endregion

function keyPressed(key) {
  //#region chat
  if (key === "Enter") {
    $chat = $("#chatprompt");
    if ($chat.css("display") == "none") {
      $chat.css("display", "block").focus();
      chatting = true;
    } else {
      $chat.css("display", "none");
      //#region cmds
      if ($chat.val().startsWith("!")) {
        var cmd = $chat.val();
        if (cmd == "!online") {
          chat.push({ id: null, msg: "Online players:", color: "#fcba03" });
          Object.keys(players).forEach(id => {
            var player = players[id];
            if (player.name != "connecting") {
              chat.push({
                id: null,
                msg: "    " + player.name,
                color: player.color
              });
            }
          });
        } else if (cmd === "!stats") {
          advancedStats = !advancedStats;
        }
        //#endregion
      } else if ($chat.val() != "") {
        postChat($chat.val());
      }
      if ($chat.val() != chatHistory[0]) {
        chatHistory.reverse();
        chatHistory.push($chat.val());
        chatHistory.reverse();
      }

      $chat.val("");
      historyIndex = -1;
      chatting = false;
    }
  }
  //#endregion
}
