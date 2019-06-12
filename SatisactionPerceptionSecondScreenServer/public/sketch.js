// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var host = 'http://localhost:3000';

var pawn_x;
var pawn_y;
var pawnCenterX;
var pawnCenterY;

let person_abstract;
let perspectives;

var bgIndex = 0;
var data;

const secondScreenWidthMin = 0;
const secondScreenWidthMax = 1280;
const secondScreenHeightMin = 0;
const secondScreenHeightMax = 800;

const boardScreenWidthMin = 0;
const boardScreenWidthMax = 1920;
const boardScreenHeightMin = 0;
const boardScreenHeightMax = 1080;

const imagePersonWidth = 177; //width of the .png image
const imagePersonHeight = 408; //height of the .png image

var d = new Date();
var currentTime = d.getMilliseconds();
var previousTime = 0;
var interval = 50;

function preload() {
  perspectives = loadImage("data/perspective4.png");
  person_abstract = loadImage("data/27.png");
}

function setup() {

  createCanvas(secondScreenWidthMax, secondScreenHeightMax);
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect(host);
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(0, 0, 255);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
  socket.on('pawnData', pawnData);
}

function draw() {
  // image(perspectives, 0, 0, 1280, 800);
  var currentTime = millis(); //new Date().getMilliseconds();
  // console.log(currentTime);
  if (currentTime - previousTime > interval) {
    socket.emit('pawnData', );
    previousTime = currentTime;
    console.log("send request");
  }
}

function pawnData(pawnData) {
  image(perspectives, 0, 0, 1280, 800);
  console.log(pawnData);
  for (var i = 0; i < pawnData.length; i++) {
    if (pawnData[i].pawn_polarity == 1) {
      pawn_x = pawnData[i].pawn_x;
      pawn_y = pawnData[i].pawn_y;
      pawnCenterX = pawnData[i].pawnCenterX;
      pawnCenterY = pawnData[i].pawnCenterY;
      identity = pawnData[i].identity;
      direction = pawnData[i].direction;
      timestamp = pawnData[i].timestamp;
      drawData();
    }
  }
}

function drawData() {
  var xp = map(pawn_y, boardScreenHeightMin, boardScreenHeightMax, secondScreenWidthMin + 100, secondScreenWidthMax - 50);
  var zp = map(pawn_x, boardScreenWidthMin, boardScreenWidthMax, secondScreenHeightMax - 50, secondScreenHeightMin + 500);
  // var xp = map(pawnCenterY, boardScreenHeightMin, boardScreenHeightMax, secondScreenWidthMin + 100, secondScreenWidthMax - 50);
  // var zp = map(pawnCenterX, boardScreenWidthMin, boardScreenWidthMax, secondScreenHeightMax - 50, secondScreenHeightMin + 500);
  var wp = (imagePersonWidth / 3);
  var hp = (imagePersonHeight / 3);

  image(person_abstract, xp - wp / 2, zp - hp, wp, hp);
  rotate(PI / 2);
  fill(0, 250, 250);
  text(identity, xp, zp + 20);
}

function keyPressed() {
  if (key === "M") {
    if (bgIndex < 6) {
      bgIndex++;
    } else {
      bgIndex = 1;
    }
    perspectives = loadImage("data/perspective" + bgIndex + ".png");
    console.log("up: " + bgIndex);
  }

  if (key === "N") {
    if (bgIndex > 1) {
      bgIndex--;
    } else {
      bgIndex = 6;
    }
    perspectives = loadImage("data/perspective" + bgIndex + ".png");
    console.log("down: " + bgIndex);
  }
}
// function mouseDragged() {
//   // Draw some white circles
//   fill(255);
//   noStroke();
//   ellipse(mouseX, mouseY, 20, 20);
//   // Send the mouse coordinates
//   sendmouse(mouseX, mouseY);
// }

// // Function for sending to the socket
// function sendmouse(xpos, ypos) {
//   // We are sending!
//   console.log("sendmouse: " + xpos + " " + ypos);
//   // Make a little object with  and y
//   var data = {
//     x: xpos,
//     y: ypos
//   };
//   // Send that object to the socket
//   socket.emit('mouse', data);
// }
