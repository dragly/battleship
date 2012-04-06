var MaskHelper = require("../shared/maskhelper.js").MaskHelper;
var ObjectHelper = require("../shared/objecthelper.js").ObjectHelper;

function GameUserData() {
    this.user = 0;
    this.boats = new Array();
    this.boatMask = new Array();
    this.shotMask = new Array();
}

function Game(nRows, nCols) {
    this.gameID = "";
    this.turn = 0;
    this.currentPlayer = 0;
    this.nRows = nRows;
    this.nCols = nCols;
    this.user = new Array();
    
    this.players = new Array();
    this.players[0] = new GameUserData();    
    this.players[1] = new GameUserData();    


    for (i = 0; i < (nRows * nCols) / 32; i++) {
        this.players[0].boatMask.push(0);
        this.players[1].boatMask.push(0);
        this.players[0].shotMask.push(0);
        this.players[1].shotMask.push(0);
    }
}
Game.prototype.getIndexOfUserID = function(userID) {

}


Game.prototype.hasUser = function (user) {
    if (user.userID === this.players[0].user.userID || user.userID === this.players[1].user.userID) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.findDestroyedBoats = function(playerIndex) {
            var boats;
            var shotMask;
            boats = this.players[playerIndex].boats;
            shotMask = this.players[playerIndex].shotMask;
            var hitBoats = new Array();
            for(var i = 0; i < boats.length; i++) {
                var boat = boats[i];
                var boatHitMask = MaskHelper.and(boat.mask(), shotMask);
                if(MaskHelper.compare(boatHitMask, boat.mask())) {
                    hitBoats.push(boat);
                }
            }
            return hitBoats;
        }
        
Game.convertGameToGameData = function(user, game) {
    var opponent = {};
    var ourBoats;
    var ourBoatMask;
    var ourShotMask;
    var theirBoats;
    var theirBoatMask;
    var theirShotMask;
    
    var ourIndex;
    var theirIndex;
    
    if(game.players[0].user.userID === user.userID) {
        ourIndex = 0;
        theirIndex = 1;
        // we are user 0
    } else {
        ourIndex = 1;
        theirIndex = 0;
        // we are user 1
    }
    ourBoats = game.players[ourIndex].boats;
    ourBoatMask = game.players[ourIndex].boatMask;
    ourShotMask = game.players[ourIndex].shotMask;

    ObjectHelper.copyDataToObject(game.players[theirIndex].user, opponent, ["userID", "username"]);
    theirBoats = game.findDestroyedBoats(theirIndex);
    theirBoatMask = game.players[theirIndex].boatMask;
    theirShotMask = game.players[theirIndex].shotMask;
    // set their boatMask to only those that we have shot
    theirBoatMask = MaskHelper.and(theirBoatMask, theirShotMask);

    // TODO Send our boats, our shot mask, our boat mask, their shot mask, our hit mask
    return {
        opponent: opponent,
        gameID: game.gameID,
        ourBoats: ourBoats,
        ourBoatMask: ourBoatMask,
        ourShotMask: ourShotMask,
        theirBoats: theirBoats,
        theirBoatMask: theirBoatMask,
        theirShotMask: theirShotMask
    };
}

exports.Game = Game;
