var Game = require("./game").Game;
var Boat = require("./boat").Boat;
var MaskHelper = require("../shared/maskhelper.js").MaskHelper;
var ObjectHelper = require("../shared/objecthelper.js").ObjectHelper;
var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

function GameManager(userManager) {
    this.games = new Array();
    this.waitingGame = new Array();
    this.currentGameID = 0;
    this.userManager = userManager;
}

GameManager.prototype.addGame = function (user) {
    
//     // Begin work in progress
//     client.incr("gameid");
//     client.get("gameid", function(err, gameid) {
//         var nBoats = 5;
//         client.hmset("game:" + gameid,
//                      "gameID", gameid,
//                      "player1", user.userid,
//                      "player2", null,
//                      "currentPlayer", user.userid,
//                      "winner", null,
//                      "remainingShots", 5,
//                      "nRows", 8,
//                      "nCols", 8,
//                      "nBoats", nBoats
//                     );
//         // Set up user data
//         for(var player = 0; player < 2; player++) {
//             client.hmset("gameplayerdata:" + gameid + ":" + player,
//                          "userid", userid,
//                          "boatMask", null,
//                          "shotMask", null,
//                          "boatsPlaced", false
//                    );
//         }
//         // Set up boats
//         for (var i = 0; i < 2; i++) {
//             for (var j = 0; j < nBoats; j++) {
//                 var size = 0;
//                 var boat;
//                 switch (j) {
//                     case 0:
//                     case 1:
//                         size = 2;
//                         break;
//                     case 2:
//                     case 3:
//                         size = 3;
//                         break;
//                     case 4:
//                         size = 4;
//                         break;
//                 }
//                 client.hmset("boatdata:" + gameid + ":" + i + ":" + j,
//                              "index", j,
//                              "size", size,
//                              "horizontal", false);
//             }
//             this.updateBoatMask(game, i);
//         }
//
//         // Add the game to player 1's list
//         client.rpush("usergame:" + user.userid, gameid);
//
//         // TODO initialize boats
//
//         client.hgetall("game:" + gameid, function(err, game) {
// //            callback(game); // use when the rest of the code is ready for it
//         });
//     });
//
    // Begin old code
    var game = new Game(8, 8);
    game.players[0].user = user;
    game.gameID = this.currentGameID;
    game.currentPlayer = user;

    console.log("Made game with user " + game.players[0].user.userID);

    this.games.push(game);
    this.currentGameID++;
    return game;
}

GameManager.prototype.findWaitingGame = function (user) {
    for( var i = 0;(i < this.waitingGame.length && i<25/*no intended crashing on my watch!*/);i++) {
        if (!this.waitingGame[i].hasUser(user))
            return i;
    }
    return null;
}

GameManager.prototype.randomGame = function (user) {
    var game = this.findWaitingGame(user);
    if (game === null) {
        console.log("Waiting game was empty or contained user " + user.userID + " already. Creating new random game.");
        game = this.addGame(user);
        this.waitingGame.push(game);
    } else {
        game = this.waitingGame[0];
        console.log("Adding user to game " + game.gameID);
        game.players[1].user = user;
        this.waitingGame.splice(0, 1);
    }
    return game;
}

// Return list of games for user
GameManager.prototype.findGamesByUser = function (user) {
    var gamesToReturn = new Array();
    for (var i = 0; i < this.games.length; i++) {
        var game = this.games[i];
        if (game.hasUser(user)) {
            gamesToReturn.push(game);
        }
    }
    return gamesToReturn;
}

// Return list of updated games for user
GameManager.prototype.findUpdatedGames = function (user, currentGames) {
    var gamesToReturn = new Array();
    var userGames = this.findGamesByUser(user);
    for (var i = 0; i < userGames.length; i++) {
        var game = userGames[i];
        var clientHadGame = false;
        for (var j = 0; j < currentGames.length; j++) {
            var currentGame = currentGames[j];
            if (game.gameID === currentGame.gameID) {
                clientHadGame = true;
                // check if user is in game and that
                if (game.turn > currentGame.turn) {
                    console.log("Pushing game with newer turn");
                    gamesToReturn.push(game);
                }
            }
        }
        if (!clientHadGame) {
            console.log("Pushing a game the client did not have");
            gamesToReturn.push(game);
        }
    }
    return gamesToReturn;
}

GameManager.prototype.findGameByID = function (gameID) {
    for (var i = 0; i < this.games.length; i++) {
        var game = this.games[i];
        if (game.gameID === gameID) {
            return game;
        }
    }
    return null;
}


exports.GameManager = GameManager;
