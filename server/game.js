var MaskHelper = require("../shared/maskhelper.js").MaskHelper;

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
Game.prototype.getIndexOfUserID = function (userID) {
    if (this.players[1].user.userID === userID)
        return 1;
    else return 0;
}


Game.prototype.hasUser = function (user) {
    if (user.userID === this.players[0].user.userID || user.userID === this.players[1].user.userID) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.findDestroyedboats = function(player) {
            var boats;
            var shotMask;
            if(player === 1) {
                boats = this.players[0].boats;
                shotMask = this.players[0].shotMask;
            } else {
                boats = this.players[1].boats;
                shotMask = this.players[1].shotMask;
            }
            var hitboats = new Array();
            for(var i = 0; i < boats.length; i++) {
                var boat = boats[i];
                var boatHitMask = MaskHelper.and(boat.mask(), shotMask);
                if(MaskHelper.compare(boatHitMask, boat.mask())) {
                    hitboats.push(boat);
                }
            }
        }

exports.Game = Game;
