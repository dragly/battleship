function Boat() {
    this.index = -1;
    this.horizontal = false;
    this.size = size;
    this.width = 0;
    this.height = 0;
}

Boat.prototype.mask = function(nRows, nCols) {
    var myMask = new Array();
    for(var i = 0; i < (nRows * nCols) / 32; i++) {
        myMask.push(0);
    }
    if(this.horizontal) {
        for(var j = 0; j < size; j++) {
            myMask = MaskHelper.setIndex(this.index+j);
        }
    } else {
        for(var j = 0; j < size; j++) {
            myMask = MaskHelper.setIndex(this.index+(nCols*j));
        }
    }
    return myMask;
}

exports.Boat = Boat;
