function Game() {
    this.gameID = 0;
    this.nRows = 8;
    this.nCols = 8;
    this.ourTiles = new Array();
    this.theirTiles = new Array();
    this.ourBoats = new Array();
    this.theirBoats = new Array();
    this.theirShotMask = new Array();
    this.ourShotMask = new Array
    this.theirBoatMask = new Array();
    this.ourBoatMask = new Array();
    this.opponent = null;
}

//Game.prototype.compareMasks = function (mask1, mask2) {
//    var outMask = new Array();
//    for (var i = 0; i < mask1.length; i++) {
//        outMask[i] = mask1[i] & mask2[i];
//    }
//    return outMask;
//}
