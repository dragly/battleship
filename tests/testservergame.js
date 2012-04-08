Game = require('../server/game').Game;
GameState = require('../server/game').GameState;
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
    var user2 = new User();
    game1.players[1].user = user2;

    // test winner check
    assert.equal(game1.findWinner(), null);

    assert.equal(game1.gameState(user1), GameState.PlaceBoats);

    game1.players[0].shotMask = game1.players[1].boatMask; // cheating, are we?

    assert.equal(game1.findWinner(), user2);

    // Test gamestate after victory
    assert.equal(game1.gameState(user1), GameState.TheyWon);
    assert.equal(game1.gameState(user2), GameState.WeWon);

    console.log("OK");
}

testServerGame();
