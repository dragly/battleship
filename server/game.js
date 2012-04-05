function Game() {
    this.gameID = "";
    this.turn = 0;
    this.currentPlayer = 0;
    this.nRows = 8;
    this.nCols = 8;
    this.p1user = 0;
    this.p2user = 0;
    this.p1Boats = new Array();
    this.p2Boats = new Array();
    this.p1BoatMask = new Array();
    this.p2BoatMask = new Array();
    this.p1HitMask = new Array();
    this.p2HitMask = new Array();
}

Game.prototype.hasUser = function(user) {
            if(user.userID === this.p1user.userID || user.userID === this.p2user.userID) {
                return true;
            } else {
                return false;
            }
        }

exports.Game = Game;
