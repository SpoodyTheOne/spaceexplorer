/** @type {HTMLCanvasElement} */
var canvas;
/** @type {CanvasRenderingContext2D} */
var ctx;

var mouse = { x: 0, y: 0, clicked: false, rclicked: false };
var keys = {};

function init() {
  canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
}

document.body.onload = () => {
  init();
  canvasResize();
  document.body.onmousemove = mousePos;
  canvas.onmousedown = mouseClick;
  canvas.onmouseup = mouseUnClick;
  canvas.oncontextmenu = event => {
    event.preventDefault();
  };

  document.onkeydown = keydown;
  document.onkeyup = keyup;
};

//#region mouse funcs
function mousePos(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function mouseClick(e) {
  if (e.button === 0) {
    mouse.clicked = true;
    if (typeof mouseClicked === "function") mouseClicked();
  } else if (e.button === 2) {
    mouse.rclicked = true;
    if (typeof rmouseClicked === "function") rmouseClicked();
  }
}

function mouseUnClick(e) {
  if (e.button === 0) mouse.clicked = false;
  else if (e.button === 2) mouse.rclicked = false;
}
//#endregion

function keydown(e) {
  keys[e.key] = true;
  if (typeof keyPressed === "function") keyPressed(e.key);
}

function keyup(e) {
  if (keys[e.key]) delete keys[e.key];
}

window.onresize = canvasResize;

function canvasResize() {
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
