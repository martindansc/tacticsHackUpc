//-- JS --
var myId;
var myClass;

//init
var socket = io();

socket.on('connection', function(){
    myId = socket.io.engine.id;
}); 

//state
user_input = function(obj) {ç
    socket.emit('addUserInput', obj);
}

reset_game = function(obj) {
    socket.emit('reset_game','');
}
