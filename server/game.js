var MaskHelper = require("../shared/maskhelper").MaskHelper;
var ObjectHelper = require("../shared/objecthelper").ObjectHelper;
var Boat = require("./boat").Boat;

var GameState = {
    PlaceBoats: 0,
    Waiting: 1,
    OurTurn: 2,
    TheirTurn: 3,
    WeWon: 4,
    TheyWon: 5
}

function GameUserData() {
    this.user = null;
    this.boats = new Array();
    this.boatMask = null;
    this.shotMask = null;
    this.boatsPlaced = false;
}

function Game(nRows, nCols) {
    this.gameID = "";
    this.turn = 0;
    this.remainingShots = 5;
    this.currentPlayer = null;
    this.nRows = nRows;
    this.nCols = nCols;
    this.user = new Array();
    this.winner = null;
    
    this.players = new Array();
    this.players[0] = new GameUserData();    
    this.players[1] = new GameUserData();

    this.initBoats();
}

Game.prototype.updateBoatMask = function(playerIndex) {
    var player = this.players[playerIndex];
    player.boatMask = this.emptyMask();
    // TODO validate that the length of the boat array is the same
    for(var i = 0; i < player.boats.length; i++) {
        var boat = player.boats[i];
        player.boatMask = MaskHelper.or(player.boatMask, boat.mask());
    }
    for(var i = 0; i < 2; i++) {
        this.players[i].shotMask = this.emptyMask();
    }
}

Game.prototype.initBoats = function() {
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 5; j++) {
            var size = 0;
            var boat;
            switch (j) {
                case 0:
                case 1:
                    size = 2;
                    break;
                case 2:
                case 3:
                    size = 3;
                    break;
                case 4:
                    size = 4;
                    break;
            }

            boat = new Boat(this);
            boat.index = j;
            boat.size = size;
            this.players[i].boats.push(boat)
        }
        this.updateBoatMask(i);
    }
}

Game.prototype.emptyMask = function() {
    var mask = new Array();
    for (var i = 0; i < (this.nRows * this.nCols) / 32; i++) {
        mask.push(0);
    }
    return mask;
}

Game.prototype.getIndexOfUser = function (user) {
    if (this.players[0].user === user)
        return 0;
    else return 1;
}


Game.prototype.hasUser = function (user) {
    if (user === this.players[0].user || user === this.players[1].user) {
        return true;
    } else {
        return false;
    }
}

// returns the winner or null if game not over
Game.prototype.findWinner = function() {
    for(var i = 0; i < 2; i++) { // for each player
        if(MaskHelper.compare(this.players[i].boatMask, MaskHelper.and(this.players[i].boatMask, this.players[i].shotMask))) {
            // This user's boat mask matches all hits, the other is a winner
            if(i == 0) {
                return this.players[1].user;
            } else {
                return this.players[0].user;
            }
        }
    }
    // if nothing has been returned, return null
    return null;
}

Game.prototype.findDestroyedBoats = function(playerIndex) {
            var boats;
            var shotMask;
            console.log("Checking destroyed boats against " + this.players[playerIndex].boats.length + " boats");
            boats = this.players[playerIndex].boats;
            shotMask = this.players[playerIndex].shotMask;
            var hitBoats = new Array();
            for(var i = 0; i < boats.length; i++) {
                var boat = boats[i];
                var boatHitMask = MaskHelper.and(boat.mask(), shotMask);
                if (MaskHelper.compare(boatHitMask, boat.mask())) {
                    hitBoats.push(boat);
                }
            }
            return hitBoats;
        }

Game.prototype.gameState = function(user) {
    var ourIndex = this.getIndexOfUser(user);
    var theirIndex = ourIndex ? 0 : 1;

    var ourPlayer = this.players[ourIndex];
    var theirPlayer = this.players[theirIndex];

    // Find the gamestate from this users view
    var gameState;
    if (this.findWinner() !== null) { // game over, we have a winner
        if(this.findWinner() === user) { // we won
            gameState = GameState.WeWon;
        } else { // they won
            gameState = GameState.TheyWon;
        }
    } else if (!ourPlayer.boatsPlaced) {
        // Come on, place your boats already!
        gameState = GameState.PlaceBoats;
    } else if (theirPlayer.user === null) {
        // No other user has joined, we are waiting.
        gameState = GameState.Waiting;
    } else if (this.currentPlayer === ourPlayer.user && theirPlayer.boatsPlaced) {
        // We are the current player and they have placed boats
        gameState = GameState.OurTurn;
    } else {
        // They are the current player and we have placed boats, or they have not placed boats yet
        gameState = GameState.TheirTurn;
    }
    return gameState;
}

Game.convertGameToGameData = function (user, game) {
    var opponent = {};

    var ourIndex = game.getIndexOfUser(user);
    var theirIndex = ourIndex ? 0 : 1;

    var ourPlayer = game.players[ourIndex];
    var theirPlayer = game.players[theirIndex];

    if (theirPlayer.user !== null) {
        ObjectHelper.copyDataToObject(theirPlayer.user, opponent, ["userID", "username"]);
    }

    var ourBoats = new Array();
    var theirDestroyedBoats = game.findDestroyedBoats(theirIndex);
    var theirBoats = new Array();

    for (var i = 0; i < ourPlayer.boats.length; i++) {
        var boat = ourPlayer.boats[i];
        ourBoats.push(boat.toBoatData());
    }
    for (var i = 0; i < theirDestroyedBoats.length; i++) {
        var boat = theirDestroyedBoats[i];
        theirBoats.push(boat.toBoatData());
    }
    var gameState = game.gameState(user);

    // TODO Send our boats, our shot mask, our boat mask, their shot mask, our hit mask
    return {
        opponent: opponent,
        gameID: game.gameID,
        ourBoats: ourBoats,
        ourBoatMask: ourPlayer.boatMask,
        ourShotMask: ourPlayer.shotMask,
        //        ourBoatsPlaced: ourPlayer.boatsPlaced,
        theirBoats: theirBoats,
        // set their boatMask to only those that we have shot
        theirBoatMask: MaskHelper.and(theirPlayer.boatMask, theirPlayer.shotMask),
        theirShotMask: theirPlayer.shotMask,
        //        theirBoatsPlaced: theirPlayer.boatsPlaced,
        nCols: game.nCols,
        nRows: game.nRows,
        gameState: gameState,
        turn: game.turn
    };
}

exports.Game = Game;
exports.GameState = GameState;
