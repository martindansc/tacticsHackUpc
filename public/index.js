//-- JS --
var myId;

//init
var socket = io();

socket.emit('set_id', myID);

//state
user_input = function(obj) {
    var info = {
        playerID : myId,
        input : obj
    }
    socket.emit('addUserInput', info);
}