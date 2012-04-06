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

exports.Game = Game;
