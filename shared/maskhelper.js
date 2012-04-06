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

MaskHelper.setIndex = function (mask, tileIndex) {
    var memberIndex = floor(TileIndex / 32);
    var nBit = TileIndex % 32;
    return (mask(i) | 0x1 << nBit);
}

MaskHelper.getValueOfIndex = function (mask, TileIndex) {
    var memberIndex = floor(TileIndex / 32);
    var nBit = TileIndex % 32;
    return ((mask(i) & 0x1 << nBIt) != 0);
}

if(typeof exports != 'undefined') {
    exports.MaskHelper = MaskHelper;
}
