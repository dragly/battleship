var MaskHelper = require("../shared/maskhelper.js").MaskHelper;
var ObjectHelper = require("../shared/objecthelper.js").ObjectHelper;

var GameState = {
    PlaceBoats: 0,
    Waiting: 1,
    OurTurn: 2,
    TheirTurn: 3
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

    for(var i = 0; i < this.players.length; i++) {
        this.players[i].boatMask = this.emptyMask();
        this.players[i].shotMask = this.emptyMask();
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

        Game.convertGameToGameData = function (user, game) {
            var opponent = {};

            var ourIndex;
            var theirIndex;

            if (game.players[0].user.userID === user.userID) {
                ourIndex = 0;
                theirIndex = 1;
                // we are user 0
            } else {
                ourIndex = 1;
                theirIndex = 0;
                // we are user 1
            }

            var ourPlayer = game.players[ourIndex];
            var theirPlayer = game.players[theirIndex];

            if (theirPlayer.user !== null) {
                ObjectHelper.copyDataToObject(theirPlayer.user, opponent, ["userID", "username"]);
            }

            // Find the gamestate from this users view
            var gameState;
            if (!ourPlayer.boatsPlaced) {
                // Come on, place your boats already!
                gameState = GameState.PlaceBoats;
            } else if (theirPlayer.user === null) {
                // No other user has joined, we are waiting.
                gameState = GameState.Waiting;
            } else if (game.currentPlayer === ourPlayer.user && theirPlayer.boatsPlaced) {
                // We are the current player and they have placed boats
                gameState = GameState.OurTurn;
            } else {
                // They are the current player and we have placed boats, or they have not placed boats yet
                gameState = GameState.TheirTurn;
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
