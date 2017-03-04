//-- JS --
var myId;
var myClass;

//init
var socket = io();

socket.on('connection', function(){
    myId = socket.io.engine.id;
}); 

//state
addUserInput = function(type, num) {
    socket.emit('addUserInput', {type : type, attack : num});
}

reset_game = function(obj) {
    socket.emit('reset_game','');
}
