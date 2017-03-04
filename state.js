
var newPlayerType = function(){

}


var state = {

};

var userInputs = {

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
    
}