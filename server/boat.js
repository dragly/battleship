var MaskHelper = require("../shared/maskhelper.js").MaskHelper;

function Boat() {
    this.index = -1;
    this.horizontal = false;
    this.size = 0;
}

Boat.prototype.mask = function(nRows, nCols) {
    var myMask = new Array();
    for(var i = 0; i < (nRows * nCols) / 32; i++) {
        myMask.push(0);
    }
    if(this.horizontal) {
        for(var j = 0; j < this.size; j++) {
            MaskHelper.setIndex(myMask, this.index+j);
        }
    } else {
        for(var j = 0; j < this.size; j++) {
            MaskHelper.setIndex(myMask, this.index+(nCols*j));
        }
    }
    return myMask;
}

exports.Boat = Boat;
