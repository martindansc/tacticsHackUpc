//-- JS --
var myId;
var myClass;

//init
var socket = io();

socket.on('connection', function(){
    myId = socket.io.engine.id;
});

socket.on('state', function(obj){
    console.log(obj);

    var playerState = obj.state;
    var globalState = obj.currentLocation;

    $('#CharacterHeader').text("Character T");
});

//state
addUserInput = function(type, num) {
    socket.emit('addUserInput', {type : type, attack : num});
}

reset_game = function(obj) {
    socket.emit('reset_game','');
}
