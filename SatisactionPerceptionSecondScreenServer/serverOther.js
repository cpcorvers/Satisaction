// index.js
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// adding security
const csrf = require('csurf');
const path = require('path');

//  Init App
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Init json file
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routings
app.get('/', (req, res) => {
  res.render('index'),{
    // csrfToken: req.csrfToken()
  };
});

app.get('/student', (req, res) => {
  res.render('student'),{
  };
});

app.get('/teacher', (req, res) => {
  res.render('teacher'),{
  };
});

app.get('/chat', (req, res) => {
  res.render('chat'),{
  };
});

app.get('/response', (req, res) => {
  res.render('response'),{
    // csrfToken: req.csrfToken()
  };
});

// Catch form submit
app.post('/student', (req, res) => {
  res.send('Your request is forwarded');
  var data = req.body;
  var roomValue = req.body.room;
  console.log('Vote data received from student client...');
  addVote();

  // script which add the input from the student client to the json file of the specific room.
  function addVote(){  // variables for the json file and an example of data for testing.
    var jsonFile = path.join(__dirname, 'dataFiles', 'vote' + req.body.room + '.json');
    console.log('Loading jsonfile... with timestamp: ' + data.timestamp)

    // set json file to an object
    var dataLoad = fs.readFileSync(jsonFile, String);
    var dataLoadReady = JSON.parse(dataLoad);

    // add the data from the student client to the object
    dataLoadReady.vote.push(data);
    var newData =  JSON.stringify(dataLoadReady);

    // write the object to the json file
    fs.writeFileSync(jsonFile, newData, null, 2);
    function finished(err) {
      console.log('Error writing to jsonfile.');
    }
    console.log('Adding data to jsonfile.... done!')

//update voteCounts for this room
var votes = dataLoadReady.vote.length;

voteCounts = 0;
for (i = 0; i < votes; i++) { //only the countable votes for a specified room
    if (dataLoadReady.vote[i].vote == "1" && dataLoadReady.vote[i].room == roomValue)
      {voteCounts++}
  }
var voteValueRoom = {room: roomValue, votes: voteCounts}
io.emit('voteUpdate', voteValueRoom);
console.log ("Votes:  ", voteValueRoom);

  }
  // res.render('response'),{};
});

// Catch teacher classroom
app.post('/teacher', (req, res) => {
  // res.send(req.body);

  var teacherRoomValue = req.body.selectTeacherroom;
  console.log('Request from teacher client...');
  showVotes();
  // This script count the votes in json for the teacher
  function showVotes () {
    var jsonFile = path.join(__dirname, 'dataFiles', 'vote' + req.body.selectTeacherroom + '.json');
    var dataLoad = fs.readFileSync(jsonFile, String);
    var dataLoadReady = JSON.parse(dataLoad);
    var room = req.body.selectTeacherroom;
    var votes = dataLoadReady.vote.length;
    voteCounts = 0;
    for (i = 0; i < votes; i++) { //only the countable votes for a specified room
        if (dataLoadReady.vote[i].vote == "1" && dataLoadReady.vote[i].room == room)
          {voteCounts++}
      }
    io.emit('voteUpdate', voteCounts);
    console.log ("Votes in ", room, ": ", voteCounts);

    }
});

// Define port
const port = 8080;

// start Server
server.listen(port, () => {
 console.log(`App running at http://localhost:` +port )
});

// connect to socket.io
io.on('connection', (socket) => {
   console.log('Client connected.....');
   io.on('disconnect', () =>{
     console.log('Client disconected...')
   })
 })
