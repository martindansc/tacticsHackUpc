var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var state = require('state');

app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Server
http.listen(3000, function(){
 	console.log('listening on *:3000');
});

//Serve html
app.get('/', function(req, res){
 	res.render('index.html', {});
});

//IO
io.on('connection', function(socket){
	
	var id = socket.id;
   
	//Get the user input
	socket.on('addUserInput', function(obj){
		obj.playerId = id;
		state.setUserInput(obj);
	});

	//Add connection
	// {numPlayer : 'num'}
	var newPlayer = state.addNewPlayer(id);
	//Send new player connection
	socket.send(newPlayer);

});