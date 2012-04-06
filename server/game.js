var MaskHelper = require("../shared/maskhelper.js").MaskHelper;

function Game(nRows, nCols) {
    this.gameID = "";
    this.turn = 0;
    this.currentPlayer = 0;
    this.nRows = nRows;
    this.nCols = nCols;
    this.p1user = 0;
    this.p2user = 0;
    this.p1Boats = new Array();
    this.p2Boats = new Array();
    this.p1BoatMask = new Array();
    this.p2BoatMask = new Array();
    this.p1ShotMask = new Array();
    this.p2ShotMask = new Array();

    for(i = 0; i < (nRows * nCols) / 32 ; i++) {
        this.p1BoatMask.push(0);
        this.p2BoatMask.push(0);
        this.p1ShotMask.push(0);
        this.p2ShotMask.push(0);
    }
}

Game.prototype.hasUser = function(user) {
            if(user.userID === this.p1user.userID || user.userID === this.p2user.userID) {
                return true;
            } else {
                return false;
            }
        }

Game.prototype.findDestroyedBoats = function(player) {
            var boats;
            var shotMask;
            if(player === 1) {
                boats = this.p1boats;
                shotMask = this.p1ShotMask;
            } else {
                boats = this.p2boats;
                shotMask = this.p2ShotMask;
            }
            var hitBoats = new Array();
            for(var i = 0; i < boats.length; i++) {
                var boat = boats[i];
                var boatHitMask = MaskHelper.and(boat.mask(), shotMask);
                if(MaskHelper.compare(boatHitMask, boat.mask())) {
                    hitBoats.push(boat);
                }
            }
        }

exports.Game = Game;
