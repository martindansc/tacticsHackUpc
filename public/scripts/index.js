//-- JS --
var myId;
var myClass;

//init
var socket = io();

socket.on('connect', function() {
  console.log('My id: ' + socket.io.engine.id);
  myId = socket.io.engine.id;
});

socket.on('state', function(obj){
    console.log(obj);

    var state = obj.state;
    var location = obj.currentLocation;

    $('#CharacterHeader').text("Character: " + state[myId].type);
});

//state
addUserInput = function(type, num) {
    socket.emit('addUserInput', {type : type, attack : num});
}

reset_game = function(obj) {
    socket.emit('reset_game','');
}
