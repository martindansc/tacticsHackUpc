var random = function(min, max) {
    return Math.floor(min + (Math.random() * max) + 1);
}

var randomWithLv = function(min, max, lv) {
    return Math.round(random(min,max)*(0.25*lv + 1));
}

var getMonsterImg = function() {
    var rand = random(1,7);
    return 'images/monster' + rand + '.png';
}

var eventGenerator = [
    { 
        function : function(floor) {
            return {
                type : "monster",
                img : getMonsterImg(monsterImagePaths),
                health : randomWithLv(10,14,floor),
                attack : randomWithLv(2,4,floor),
                lv : random(2,3),
            }
        },
        apperingProb : 20
    },
    {
        function : function(floor) {
            return {
                type : "trap",
                img : getMonsterImg(easyImagePaths),
                health : randomWithLv(7,10,floor),
                attack : randomWithLv(4,7,floor),
                lv : random(1,2),
            }
        },
        apperingProb : 10
    },
    {
        function: function(floor) {
            return {
                type : "reward",
                lv : random(0,7) - 1,
            }
        },
        apperingProb : 10
    },
    {
        function : function(floor) {
            return {
                type : "heal",
                lv : random(0,7) - 2,
            }
        },
        apperingProb : 10
    },
];

var maxApperingProb = 0;
for(var i in eventGenerator) {
    maxApperingProb += eventGenerator[i].apperingProb;
}


var bossFight = function(){
    return {
                type : "monster",
                img : getMonsterImg(easyImagePaths),
                health : randomWithLv(14,17,5),
                attack : randomWithLv(6,9,5),
                lv : random(6,8),
            }
}


var generateEvent  = function(floor) {

    var localApperingProb = maxApperingProb;

    //get one random event
    for(var i in eventGenerator) {
        var eventApperincProb = eventGenerator[i].apperingProb;
        var rand = random(0, localApperingProb);
        if(rand <= eventApperincProb) {
            return eventGenerator[i].function(floor);
        }
        eventApperincProb -= localApperingProb;
    }

    console.error("No event selected");
}

exports.generateEvent = generateEvent;