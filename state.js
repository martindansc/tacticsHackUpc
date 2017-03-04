var info = require('./info').info;


var newPlayerType = function(){
    var available = ["paladin", "mage", "thief", "samurai"];
    var toRemove = [];
    //Afegeixes a toRemove els types ja pillats
    for (var id in state){
        if (state.hasOwnProperty[id]){
            toRemove.push(state[id].type); 
        }
    }
    //Elimines types pillats de available
    available = available.filter(function(x) { return toRemove.indexOf(x) < 0});
    //Tipus random dels available que quedin
    var selectedType = available[Math.floor((Math.random() * available.length) + 1)];
    return selectedType; 
}

var currentLocation = {};
var state = {};
var userInputs = {};
var playing = false;

var io;
var setIo = function(newIo) {
    io = newIo;
}

var sendState = function() {
    io.send('state', state);
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