// Partly based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const app = express();
const server = app.listen(process.env.PORT || 3000, listen);
const io = require('socket.io')(server);
// const port_a = 8080;

// const appBoard = express();
// const serverBoard = appBoard.listen(process.env.PORT || 4000, listenBoard);

// const jsonFile = '/Users/PeterMacBookPro/Documents/Coding/Kinect/SatisactionPerceptionBoard/data/data.json';
const fs = require('fs');
var timestamp = parseInt(new Date().getTime() / 1000);

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// appBoard.use(bodyParser.json()); // support json encoded bodies
// appBoard.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
};
// function listenBoard() {
//   var hostBoard = serverBoard.address().address;
//   var portBoard = serverBoard.address().port;
//   console.log('Example app listening at http://' + hostBoard + ':' + portBoard);
// }

// appBoard.get('/', (req, res) => {
//   console.log("request from processing client over 4000: " + req.data);
// });

app.get('/student', (req, res) => {
  var timestamp = parseInt(new Date().getTime() / 1000);
  loadPawnData();
  var reply = {
    msg: "thank you",
    time: timestamp
  }
  res.send(reply.msg + " your request is receive at: " + reply.time);
  // io.sockets.emit('pawn', pawnData);
  // console.log(pawnData);
  // socket.broadcast.emit('pawn', pawnData);
});

app.get('/master', (req, res) => {
  res.render('autoSketch'),{
  };
});

function loadPawnData() {
  var jsonFile = '/Users/PeterMacBookPro/Documents/Coding/Kinect/SatisactionPerceptionBoard/data/data.json';
  var dataLoad = fs.readFileSync(jsonFile, String);
  var pawnData = JSON.parse(dataLoad); //json array from file

  // const jsonFileUpload = '/Users/PeterMacBookPro/Documents/Coding/Sockets_test kopie/public/data/data.json';
  // var pawnDataUpload = JSON.stringify(pawnData);
  // var dataUpLoad = fs.writeFileSync(jsonFileUpload, pawnDataUpload, String);

  io.sockets.emit('pawnData', pawnData.pawns);
  // io.sockets.emit('pawnData', pawnData);
  console.log("emmitting data to clients");
};

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");
      }
    );

    socket.on('pawnData', function(data) {
      loadPawnData();
    });

    socket.on('disconnect',
      function() {
        console.log("Client has disconnected");
      }
    );
  }
);
