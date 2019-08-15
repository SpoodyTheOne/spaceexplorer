//#region game

var world = planck.World({
  gravity: planck.Vec2(0, 0)
});

var ground = world.createBody({
  type: "static",
  position: planck.Vec2(2, 5),
});

ground.createFixture(planck.Edge(planck.Vec2(-400, 0), planck.Vec2(400, 0)));

function game() {
  Camera.moveTo(
    Vector.add(
      Camera.position,
      Vector.div(Vector.sub(localPlayer.body.getPosition(), Camera.position), {
        x: 2,
        y: 2
      })
    )
  );

  world.step(1 / 60);

  var groundPos = ground.getPosition();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //star background

  ctx.fillStyle = "#000000";
  /*
    Object.keys(players).forEach(id => {
      var player = players[id];
      if (player != localPlayer) {
        ctx.fillStyle = player.color;
        var camPos = Camera.toCamPos(player.pos);
        ctx.fillRect(camPos.x - 10, camPos.y - 10, 20, 20);
      }
    });
    */

  if (typeof localPlayer.body != null) {
    /*
    ctx.fillStyle = localPlayer.color;
    var camPos = Camera.toCamPos(localPlayer.pos);
    ctx.fillRect(camPos.x - 10, camPos.y - 10, 20, 20);
    */

    var dir = {
      x: 0,
      y: 0
    };

    if (!chatting) {
      if (keys["w"]) dir.y -= 1;
      //if (keys["s"]) dir.y += 1;
      if (keys["a"]) dir.x -= 1;
      if (keys["d"]) dir.x += 1;
    }

    var pos = {
      x: localPlayer.body.getPosition().x + localPlayer.body.c_velocity.v.x,
      y: localPlayer.body.getPosition().y + localPlayer.body.c_velocity.v.y
    };

    localPlayer.body.m_angularVelocity += dir.x / 26;

    var forward = {
      x: Math.cos(localPlayer.body.getAngle() + Math.PI / 2),
      y: Math.sin(localPlayer.body.getAngle() + Math.PI / 2)
    };

    if (dir.y != 0 && totalFrames % 2 == 0) {
      playSound("20hz");
      particle({type:"rect",vel:forward,pos:Vector.add(localPlayer.body.getPosition(),Vector.mult(forward,{x:18,y:18})),size:8})
    }

    localPlayer.pos = pos;

    localPlayer.body.applyForceToCenter(planck.Vec2(forward.x, forward.y).mul(100 * dir.y, 100 * dir.y));

    socket.emit("move", {
      id: localPlayer.id,
      pos: localPlayer.body.getPosition(),
      vel: localPlayer.body.c_velocity.v,
      ang: localPlayer.body.getAngle(),
      angvel: localPlayer.body.m_angularVelocity
    });

    //localPlayer.vel.x /= 1.15;
    //localPlayer.vel.y /= 1.15;
  }
  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#ff0000";

  for (var body = world.getBodyList(); body; body = body.getNext()) {
    ctx.save();
    var cp = Camera.toCamPos(body.getPosition());
    var type = "";
    ctx.translate(cp.x, cp.y);
    ctx.rotate(body.getAngle());
    ctx.beginPath();
    for (
      var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()
    ) {
      if (fixture.m_shape.m_type == "polygon") {
        type = "polygon"
        var vertex = fixture.m_shape.m_vertices;
        vertex.forEach((v, i) => {
          var pos = v;
          if (i == 0) {
            ctx.moveTo(pos.x, pos.y);
          }
          ctx.lineTo(pos.x, pos.y);
        });
      } else if (fixture.m_shape.m_type == "edge") {
        type = "edge";
        var index = 0;
        var shape = fixture.m_shape;

        ctx.moveTo(shape.m_vertex0.x, shape.m_vertex0.y);

        for (let i = 0; i < Object.keys(shape).length; i++) {
          if (shape["m_vertex" + index] != null) {
            var v = shape["m_vertex" + i];
            var pos = v;

            ctx.lineTo(pos.x, pos.y);
            index++

          } else {
            break;
          }
        }

      }
    }

    if (body.isPlayerBody)
      ctx.fillStyle = body.isPlayerBody.color;

    if (type === "polygon") {
      ctx.closePath();
      ctx.fill();
    } else if (type === "edge")
      ctx.stroke()

    if (body.isPlayerBody) {
      ctx.drawImage(img_rocket, -32, -32);
    }
    ctx.restore();
  }

  ctx.textAlign = "center";

  particles.forEach(p => {
    p.draw();
  })

  Object.keys(players).forEach(id => {
    var player = players[id];
    if (player.body != null) {
      var p = Camera.toCamPos(player.body.getPosition());
      var length = ctx.measureText(player.name);
      var padding = 6;

      ctx.fillStyle = "#333333";
      ctx.fillRect(p.x - (length.width / 2 + padding / 2), p.y - (50 + padding / 2), length.width + padding, 12 + padding);
      ctx.fillStyle = player.color;
      ctx.fillText(player.name, p.x, p.y - 50);
    }
  })
}
//#endregion

//#region ui

var chat = [{
  id: null,
  msg: "Welcome to space explorer! press ENTER to start chatting!",
  color: "#fcba03"
}];

var chatHistory = [];

var historyIndex = 0;

var advancedStats = false;

function ui() {
  //#region chat
  ctx.fillStyle = "#000000aa";
  ctx.fillRect(20, canvas.height - 270, 500, 250);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
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

    if (ctx.measureText(msg) > 200) {}
    ctx.fillStyle = chat.color;

    ctx.fillText(msg, 25, canvas.height - 265 + 15 * i);
  });
  //#endregion

  if (advancedStats) {
    ctx.fillText("fps:" + fps, 0, 0);
    ctx.fillText("velocity: x:" + (Math.round(localPlayer.body.c_velocity.v.x * 100) / 100) + " y:" + (Math.round(localPlayer.body.c_velocity.v.y * 100) / 100), 0, 13);
    ctx.fillText("speed:" + Math.round(Vector.magnitude(localPlayer.body.c_velocity.v) * 100) / 100, 0, 13 * 2);
    ctx.fillText("angvel:" + Math.round(localPlayer.body.m_angularVelocity * 10) / 10, 0, 13 * 3)
    ctx.fillText("position: x:" + (Math.round(localPlayer.body.getPosition().x * 100) / 100) + " y:" + (Math.round(localPlayer.body.getPosition().y * 100) / 100), 0, 13 * 4);

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
          chat.push({
            id: null,
            msg: "Online players:",
            color: "#fcba03"
          });
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