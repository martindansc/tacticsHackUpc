var info = require('./info').info;
var eve = require('./events');

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
    io.emit('state', {state : state, currentLocation : currentLocation});
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
    var rand = Math.floor((Math.random() * available.length));
    if(rand > 3) console.error(rand);
    var selectedType = available[rand];
    return selectedType; 
}

var calculateCombat = function(){
    var totalDamage = 0;
    var fighters = JSON.parse(JSON.stringify(userInputs));

    //remove not participating players in case of mimic
    if (currentLocation.event.type == "trap"){
        var notParticipating = [];
        for (var id in userInputs){
            if (userInputs.hasOwnProperty[id]){
                if (userInputs[id].numAttack == 0) notParticipating.push(id);
            }
        }
        fighters = fighters.filter(function(x) { 
            return notParticipating.indexOf(x) < 0;
        });
    }

    //calc player combat damage
    for (var id in fighters){
        if (fighters.hasOwnProperty[id]){
            totalDamage += fighters[id].numAttack;
        }
    }
    //apply spells (TODO)
    if (currentLocation.event.health > totalDamage){
        //monster lives
        var lessDamage = Infinity;
        for (var id in fighters){
            if (fighters.hasOwnProperty[id]){
                if (fighters[id].numAttack < lessDamage) lessDamage = fighters[id].numAttack;
            }
        }
        for (var id in fighters){
            if (fighters.hasOwnProperty[id]){
                if (fighters[id].numAttack == lessDamage) {
                    state[id].health -= currentLocation.event.attack;
                }
            }
        }
    }
    else{
        //monster dies
        var mostDamage = 0;
        for (var id in fighters){
            if (fighters.hasOwnProperty[id]){
                if (fighters[id].numAttack > mostDamage) mostDamage = fighters[id].numAttack;
            }
        }
        for (var id in fighters){
            if (fighters.hasOwnProperty[id]){
                if (fighters[id].numAttack == mostDamage) {
                    state[id].lv += currentLocation.event.lv;
                }
            }
        }
    }
}

var calculateTreasure = function(){
    var highestRoll = 0;
    for (var id in userInputs){
        if (userInputs.hasOwnProperty[id]){
            if (userInputs[id].numAttack > highestRoll) highestRoll = userInputs[id].numAttack;
        }
    }
    //room has a level reward
    if (currentLocation.type == "reward"){
        for (var id in userInputs){
            if (userInputs.hasOwnProperty[id]){
                if (userInputs[id].numAttack == highestRoll) {
                    state[id].lv += currentLocation.event.lv;
                }
            }
        }
    }
    //healing room
    else if (currentLocation.type == "heal"){
        for (var id in userInputs){
            if (userInputs.hasOwnProperty[id]){
                if (userInputs[id].numAttack == highestRoll) {
                    state[id].health = min(state[id].health + currentLocation.lv,
                                            info[state[id].type].health);
                }
            }
        }
    }
}

var checkDeath = function(){
    for (var id in state){
        if (state.hasOwnProperty[id]){
            if (state[id].health < 1){
                io.emit("endGame", "");
                break;
            }
        }
    }
}

var sendNewState = function() {
    //remove used attacks from current floor and clear input
    for(var id in userInputs) {
        //spells on cd
        state[id].spells[userInputs[id].spell] = false;
        //used cards
        state[id].availableNums = state[id].availableNums.filter(function(x) { 
            return userInputs[id].numAttack !== x;
        });
        userInputs[id] = {id : id, spell : '', numAttack : -1};
    }
    //advance room and floor if needed, generate new event
    var newRoom = (currentLocation.room + 1) % 5;
    var newFloor = currentLocation.floor + (newRoom == 0);
    var newEvent;
    if (newRoom == 4 && newFloor == 4) newEvent = eve.bossFight();
    else newEvent = eve.generateEvent(newFloor);

    //reset cds if new floor
    if (newRoom == 0){
        for(var id in state){
            var plyertype = state[id].type;
            state[id].spells = info[playerType].spells;
            state[id].availableNums = info[playerType].nums;
        }
    }
    currentLocation = {floor : newFloor, room : newRoom, event : newEvent};

    sendState();
}

var calculateNewState = function() {
    switch (currentLocation.event.type) {
        case "monster" :
            calculateCombat();
            break;
        case "reward" :
            calculateTreasure();
            break;
        case "trap" :
            calculateCombat();
            break;
        case "heal" :
            calculateTreasure();
            break;    
    }

    checkDeath();
    sendNewState();

}

var resetGame = function() {
    state = {};
    playing = false;
}

var startGame = function() {

    for(i in userInputs) {
        userInputs[i] = {id : i, spell : '', numAttack : -1};
    }

    currentLocation = {floor : 0, room : 0, event : eve.generateEvent(1)};
    playing = true;
    sendState();
}

var checkAllPlayersMoved = function() {
    for(var i in userInputs) {
        var input = userInputs[i];
        if(input.numAttack == -1) return false;
    }
    return true;
}

var setUserInput = function(obj) {
    var id = obj.id;
    var attack = obj.attack;
    var type = obj.type;
    if (type === "attack") { //attack is a card
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

var addNewPlayer = function(id) {

    var playerType = newPlayerType();

    //create new player obj
    var newPlayerObj = {
        id : id, 
        type : playerType, 
        health : info[playerType].health, 
        lv : 0, 
        spells : info[playerType].spells, 
        availableNums : info[playerType].nums
    };
    state[id] = newPlayerObj;
    
    //create user input obj
    userInputs[id] = {id : id, spell : '', numAttack : -1};

    //check that are players
    if(Object.keys(userInputs).length == 1) {
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