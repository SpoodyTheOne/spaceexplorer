//#region game
function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //star background

  ctx.fillStyle = "#000000";

  Object.keys(players).forEach(id => {
    var player = players[id];

    ctx.fillStyle = player.color;
    var camPos = Camera.toCamPos(player.pos);
    ctx.fillRect(camPos.x, camPos.y, 50, 50);
  });

  var dir = { x: 0, y: 0 };

  if (keys["w"]) dir.y -= 1;
  if (keys["s"]) dir.y += 1;
  if (keys["a"]) dir.x -= 1;
  if (keys["d"]) dir.x += 1;

    socket.emit("move", {
        id: localPlayer.id,
        pos: { x: localPlayer.pos.x + dir.x, y: localPlayer.pos.y + dir.y }
      });
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

  chat.forEach(chat => {
    var msg = "";
    if (chat.id == null) {
      msg = chat.msg;
    } else {
      msg = players[chat.id].name + ": " + chat.msg;
    }
  });

  chat.forEach((chat, i) => {
    var msg = "";
    if (chat.id == null) {
      msg = chat.msg;
    } else {
      msg = players[chat.id].name + ": " + chat.msg;
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
    }
  }
  //#endregion
}
