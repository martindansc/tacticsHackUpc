//-- JS --
var myId;
var myClass;

//init
var socket = io();

socket.on('id', function(id){
    myId = id;
});

socket.on('state', function(obj){
    console.log(myId);
    console.log(obj);

    var playerState = obj.state;
    var globalState = obj.currentLocation;

    $('#CharacterHeader').text(playerState[myId].type);
    //$('#Health').text("Health: " + state.id.)
    //$('#Level')
});

//state
addUserInput = function(type, num) {
    socket.emit('addUserInput', {type : type, attack : num});
}

reset_game = function(obj) {
    socket.emit('reset_game','');
}
