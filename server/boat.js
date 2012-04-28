var MaskHelper = require("../shared/maskhelper.js").MaskHelper;
var ObjectHelper = require("../shared/objecthelper.js").ObjectHelper;
function Boat(game) {
    this.index = -1;
    this.horizontal = false;
    this.size = 0;
    this.nRows = game.nRows;
    this.nCols = game.nCols;
}

Boat.prototype.mask = function() {
    var nRows = this.nRows;
    var nCols = this.nCols;
    var myMask = new Array();
    for(var i = 0; i < (nRows * nCols) / 32; i++) {
        myMask.push(0);
    }
    if(this.horizontal) {
        for (var j = 0; j < this.size; j++) {
            if (this.index % nCols + this.size <= nCols)
                MaskHelper.setIndex(myMask, this.index+j);
        }
    } else {
        for (var j = 0; j < this.size; j++) {
            if (Math.floor(this.index / nCols) + this.size <= nRows)
                MaskHelper.setIndex(myMask, this.index+(nCols*j));
        }
    }
    return myMask;
}

Boat.prototype.toBoatData = function() {
    var boatData = {};
    var boatDataToCopy = ["index", "size", "horizontal"];
    ObjectHelper.copyDataToObject(this, boatData, boatDataToCopy);
    return boatData;
}

exports.Boat = Boat;
