function MaskHelper() {

}

MaskHelper.and = function (mask1, mask2) {
    var mask = new Array();
    for (var i = 0; i < mask1.length; i++) {
        mask.push(mask1[i] & mask2[i]);
    }
    return mask;
}

MaskHelper.or = function (mask1, mask2) {
    var mask = new Array();
    for (var i = 0; i < mask1.length; i++) {
        mask.push(mask1[i] | mask2[i]);
    }
    return mask;
}

MaskHelper.xor = function (mask1, mask2) {
    var mask = new Array();
    for (var i = 0; i < mask1.length; i++) {
        mask.push(mask1[i] ^ mask2[i]);
    }
    return mask;
}

MaskHelper.compare = function (mask1, mask2) {
    var isEqual = true;
    for (var i = 0; i < mask1.length; i++) {
        if (mask1[i] !== mask2[i]) {
            isEqual = false;
        }
    }
    return isEqual;
}

MaskHelper.setIndex = function (mask, tileIndex, value) {
    if(value === undefined) {
        value = 0x1;
    }
    var memberIndex = Math.floor(tileIndex / 32);
    var nBit = tileIndex % 32;
    mask[memberIndex] = (mask[memberIndex] | (value << nBit));
}

MaskHelper.getValueOfIndex = function (mask, tileIndex) {
    var memberIndex = Math.floor(tileIndex / 32);
    var nBit = tileIndex % 32;
    return ((mask[memberIndex] & (0x1 << nBit)) !== 0);
}

if(typeof exports != 'undefined') {
    exports.MaskHelper = MaskHelper;
}

MaskHelper.getNumSetFlags = function (mask) {
    var numFlags=0;       
    for (var i = 0; i < mask.length;i++ ) {
        for (var j = 0; j < 32;j++ ) {  //TODO if resoruces need to be saved: tempstore and shift one bit at a time
            if (((mask[i] >> j) & 0x1) == 0x1) {
                numFlags++;
            }
        }
    }
    return numFlags;
}