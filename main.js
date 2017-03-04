var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var state = require('./state');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Server
http.listen(3000, function(){
 	console.log('listening on *:3000');
});

state.setIo(io);

//IO
io.on('connection', function(socket){
	
	var id = socket.id;
   
	//Get the user input
	socket.on('addUserInput', function(obj){
		obj.playerId = id;
		state.setUserInput(obj);
	});

	//Get the user input
	socket.on('resetGame', function(obj){
		state.resetGame();
	});

	socket.on('disconnect', function() {
		if(!state.playing) state.deletePlayer(id);	
	});

	//Add connection
	var newPlayer = state.addNewPlayer(id);

});