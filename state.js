var state = {

};

var userInputs = {

}

var setUserInput = function(obj) {

}

var addNewPlayer = function(obj) {
    var id = obj.id;

    //create new player obj
    var newPlayerObj = {id : id, };
    state[id] = newPlayerObj;
    
    //create user input obj
    userInputObj[id] = {id : id, spell : '', numAttack : -1};
}

exports.setUserInput = setUserInput;
exports.addNewPlayer = addNewPlayer;