var info = require('./info').info;

var currentLocation = {};
var state = {};
var userInputs = {};
var playing = false;

//Should be executed before calling any io function
var io;
var setIo = function(newIo) {
    io = newIo;
}

var sendState = function() {
    io.send('state', state);
}

var newPlayerType = function(){
    var available = ["paladin", "mage", "thief", "samurai"];
    var toRemove = [];
    
    //Add to toRemove types already 
    for (var id in state){
        if (state.hasOwnProperty[id]){
            toRemove.push(state[id].type); 
        }
    }

    //Delete types that are 
    available = available.filter(function(x) { 
        return toRemove.indexOf(x) < 0;
    });

    //Random available
    var selectedType = available[Math.floor((Math.random() * available.length) + 1)];
    return selectedType; 
}

var calculateNewState = function() {

}

var resetGame = function() {
    state = {};
}

var startGame = function() {
    userInputs = {};
    currentLocation = {floor : 1, room : 1};
    sendState();
}

var setUserInput = function(obj) {
    var id = obj.id;
    var attack = obj.attack;
    if (attack % 1 === 0) { //attack is a card
        userInputs[id].numAttack = attack;
    }
    else { //attack is spell
        userInputs[id].spell = attack;
    }

    if(checkAllPlayersMoved()) {
        calculateNewState();
        sendState();
    }
}

var addNewPlayer = function(obj) {

    //check that are less than 4 players
    if(obj) return;

    var id = obj.id;
    var playerType = newPlayerType();

    //create new player obj
    var newPlayerObj = {
        id : id, 
        type : playerType, 
        health : info[playerType].health, 
        lv : 0, 
        spells : info[playerType].spells, 
        avaliableNums : [1,2,3,4,5]
    };
    state[id] = newPlayerObj;
    
    //create user input obj
    userInputObj[id] = {id : id, spell : '', numAttack : -1};

    if(Object.keys(obj).length == 4) {
        startGame();
    }
}

var deletePlayer = function(id) {
    delete state[id];
    delete userInputs[id];

    sendState();
}

//public atributes
exports.playing = playing;

//functions
exports.resetGame = resetGame;
exports.startGame = startGame;
exports.setUserInput = setUserInput;
exports.addNewPlayer = addNewPlayer;
exports.deletePlayer = deletePlayer;

//get IO
exports.setIo = setIo;