assert = require('assert');
Boat = require('../server/boat').Boat;
Game = require('../server/game').Game;

function testServerBoat() {
    console.log("== Testing server Boat ==");

    var game = new Game(8,8);
    var boat1 = new Boat(game);
    boat1.index = 0;
    boat1.size = 3;
    boat1.horizontal = true;
    assert.deepEqual(boat1.mask(), new Array(7,0));

    var boat2 = new Boat(game);
    boat2.index = 3;
    boat2.size = 3;
    boat2.horizontal = false;
    assert.deepEqual(boat2.mask(), new Array(Math.pow(2,3) + Math.pow(2,3+8) + Math.pow(2,3+8+8),0));

    var boatData = boat2.toBoatData()
    assert.equal(boatData.index, boat2.index);
    assert.equal(boatData.size, boat2.size);
    assert.equal(boatData.horizontal, boat2.horizontal);
    console.log("OK");
}
testServerBoat();
