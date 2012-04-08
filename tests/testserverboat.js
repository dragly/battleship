assert = require('assert');
Boat = require('../server/boat').Boat;

function testServerBoat() {
    console.log("== Testing server Boat ==");

    var boat1 = new Boat();
    boat1.index = 0;
    boat1.size = 3;
    boat1.horizontal = true;
    assert.deepEqual(boat1.mask(8,8), new Array(7,0));

    var boat2 = new Boat();
    boat2.index = 3;
    boat2.size = 3;
    boat2.horizontal = false;
    assert.deepEqual(boat2.mask(8,8), new Array(Math.pow(2,3) + Math.pow(2,3+8) + Math.pow(2,3+8+8),0));
    console.log("OK");
}
testServerBoat();
