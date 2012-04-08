MaskHelper = require("../shared/maskhelper").MaskHelper;

function testMaskHelper() {
    console.log("== Testing MaskHelper ==");
    assert.deepEqual(MaskHelper.and(new Array(2,6,12),new Array(2,2,4)), new Array(2,2,4));
    assert.deepEqual(MaskHelper.or(new Array(2,6,12),new Array(4,2,3)), new Array(6,6,15));
    assert.deepEqual(MaskHelper.xor(new Array(2,6,12),new Array(4,2,3)), new Array(6,4,15));
    assert.equal(MaskHelper.compare(new Array(2,6,12),new Array(4,2,3)), false);
    assert.equal(MaskHelper.compare(new Array(2,6,12),new Array(2,6,12)), true);
    var testMask = new Array(2,6,12);
    MaskHelper.setIndex(testMask,4);
    assert.deepEqual(testMask, new Array(18,6,12));
    testMask = new Array(0,0,0);
    MaskHelper.setIndex(testMask,34);
    assert.deepEqual(testMask, new Array(0,4,0));
    testMask = new Array(0,6,0);
    assert.deepEqual(MaskHelper.getValueOfIndex(testMask,33), 1);
    assert.deepEqual(MaskHelper.getValueOfIndex(testMask,32), 0);
    console.log("OK");
}

testMaskHelper();
