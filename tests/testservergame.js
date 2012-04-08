Game = require('../server/game').Game;
Boat = require('../server/boat').Boat;
User = require('../server/user').User;

function testServerGame() {
    console.log("== Testing server Game ==");
    var game1 = new Game(8,8);
    assert.equal(game1.players[0].user, null);
    assert.equal(game1.players[1].user, null);
    var user1 = new User();
    assert.equal(game1.hasUser(user1), false);
    game1.players[0].user = user1;
    assert.equal(game1.hasUser(user1), true);
    console.log("OK");
}

testServerGame();
