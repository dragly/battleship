function MaskHelper() {

}

Maskhelper.prototype.and = function(mask1, mask2) {
            var mask = new Array();
            for(var i = 0; i < mask1.length; i++) {
                mask.push(mask1[i] & mask2[i]);
            }
            return mask;
        }

Maskhelper.prototype.or = function(mask1, mask2) {
            var mask = new Array();
            for(var i = 0; i < mask1.length; i++) {
                mask.push(mask1[i] | mask2[i]);
            }
            return mask;
        }

Maskhelper.prototype.xor = function(mask1, mask2) {
            var mask = new Array();
            for(var i = 0; i < mask1.length; i++) {
                mask.push(mask1[i] ^ mask2[i]);
            }
            return mask;
        }

Maskhelper.prototype.compare = function(mask1, mask2) {
            var isEqual = true;
            for(var i = 0; i < mask1.length; i++) {
                if(mask1[i] !== mask2[i]) {
                    isEqual = false;
                }
            }
            return isEqual;
        }

exports.MaskHelper = MaskHelper;
