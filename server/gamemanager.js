var Game = require("./game").Game;
var Boat = require("./boat").Boat;
var MaskHelper = require("../shared/maskhelper.js").MaskHelper;
var ObjectHelper = require("../shared/objecthelper.js").ObjectHelper;

var redis = require("redis"),
    client = redis.createClient();

function GameManager(userManager) {
    this.games = new Array();
    this.waitingGame = new Array();
    this.currentGameID = 0;
    this.userManager = userManager;
}

//GameManager.prototype.addGame = function (user) {

//    var game = new Game(8, 8);
//    game.players[0].user = user;
//    game.gameID = this.currentGameID;
//    game.currentPlayer = user;

//    console.log("Made game with user " + game.players[0].user.userID);

//    this.games.push(game);
//    this.currentGameID++;
//    return game;
//}

GameManager.prototype.gameHasUser = function(game, user) {
    if (user.userID === game.player0 || user.userID === game.player1) {
        return true;
    } else {
        return false;
    }
}

GameManager.prototype.randomGame = function (user, callback) {
    var self = this;
    client.lrange("waitingGames", 0, -1, function(err, waitingGames) { // get all waitingGames IDs
        var hasGame = false;
        for(var i = 0; i < waitingGames && !hasGame; i++) { // TODO: Reimplement no crashing on my watch i < 25 and that stuff
            var waitingGame = waitingGames[i];
            if(waitingGame.userID !== user.userID) {
                hasGame = true;
                client.hgetall("game:" + waitingGame.gameID, function(err, game) { // get the game data
                    client.lrem("waitingGames", 1, waitingGame, function(err, ignored) { // remove from waitingGame list
                        callback(err, game);
                    });
                });
            }
        }
        if(!hasGame) { // found no waiting game, creating a new one instead
            client.incr("global:nextGameID", function(err, gameID) {
                var game = new Game(8, 8);
                game.gameID = gameID;
                game.players[0].userID = user.userID;
                console.log(JSON.stringify(game));
                client.hset("game:" + gameID, JSON.stringify(game), function(err, response) {
                    callback(err, game);
                });
            });
        }
    });
//    for( var i = 0;(i < this.waitingGame.length && i<25/*no intended crashing on my watch!*/);i++) {
//        if (!this.waitingGame[i].hasUser(user))
//            return i;
//    }
//    var game = this.findWaitingGame(user);
//    if (game === null) {
//        console.log("Waiting game was empty or contained user " + user.userID + " already. Creating new random game.");
//        game = this.addGame(user);
//        this.waitingGame.push(game);
//    } else {
//        game = this.waitingGame[0];
//        console.log("Adding user to game " + game.gameID);
//        game.players[1].user = user;
//        this.waitingGame.splice(0, 1);
//    }
//    return game;
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
