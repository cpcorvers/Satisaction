// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var previousTime = 0;
var interval = 5000;
var timestamp = parseInt(new Date().getTime() / 1000);
var emmit = false;

function setup() {
  createCanvas(600, 600);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://10.0.1.3:3000');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  // socket.on('mouse',
  //   // When we receive data
  //   function(data) {
  //     console.log("Got: " + data.x + " " + data.y);
  //     // Draw a blue circle
  //     fill(0,0,255);
  //     noStroke();
  //     ellipse(data.x, data.y, 20, 20);
  //   }
  // );

  button = createButton('START / STOP emmiting data to clients');
  button.position(75, 150);
  button.mousePressed(changeBG);
  // button.size(200, 50);
}

function changeBG() {
  if (emmit == true) {
    emmit = false;
  } else {
    emmit = true;
  }
}


function draw() {
  background(0);
  push();
  fill(250, 0, 125);
  textSize(25);
  text("This is the master control page", 50, 50);
  text("Status emmit:", 50, 100);
  pop();


  if (emmit == true) {
    var currentTime = millis(); //new Date().getMilliseconds();
    // console.log(currentTime);
    fill(0, 250, 0);
    ellipse(300, 150, 40, 40);
    if (currentTime - previousTime > interval) {
      socket.emit('pawnData', timestamp);
      previousTime = currentTime;
      console.log("send request");
    }
  } else {
    fill(250, 0, 0);
    ellipse(300, 150, 40, 40);
  }
}

// function mouseDragged() {
//   // Draw some white circles
//   fill(255);
//   noStroke();
//   ellipse(mouseX,mouseY,20,20);
//   // Send the mouse coordinates
//   sendmouse(mouseX,mouseY);
// }
//
// // Function for sending to the socket
// function sendmouse(xpos, ypos) {
//   // We are sending!
//   console.log("sendmouse: " + xpos + " " + ypos);
//
//   // Make a little object with  and y
//   var data = {
//     x: xpos,
//     y: ypos
//   };
//
//   // Send that object to the socket
//   socket.emit('mouse',data);
// }
