var Game = require("./game").Game;
var MaskHelper = require("../shared/maskhelper.js").MaskHelper;

function GameManager(userManager) {
    this.games = new Array();
    this.waitingGame = new Array();
    this.currentGameID = 0;
    this.userManager = userManager;
}

GameManager.prototype.addGame = function(user) {
            var game = new Game(8, 8);
            game.p1user = user;
            game.gameID = this.currentGameID;

            console.log("Made game with user " + game.p1user.userID);

            this.games.push(game);
            this.currentGameID++;
            return game;
        }

GameManager.prototype.randomGame = function(user) {
            var game;
            if(this.waitingGame.length < 1 || this.waitingGame[0].hasUser(user)) {
                console.log("Waiting game was empty or contained user already. Creating new random game.");
                game = this.addGame(user);
                this.waitingGame.push(game);
            } else {
                game = this.waitingGame[0];
                console.log("Adding user to game " + game.gameID);
                game.p2user = user;
                this.waitingGame.pop();
            }
            return game;
        }

// Return list of games for user
GameManager.prototype.findGamesByUser = function(user) {
            var gamesToReturn = new Array();
            for(var i = 0; i < this.games.length; i++) {
                var game = this.games[i];
                if(game.hasUser(user)) {
                    gamesToReturn.push(game);
                }
            }
            return gamesToReturn;
        }

// Return list of updated games for user
GameManager.prototype.findUpdatedGames = function(user, currentGames) {
            var gamesToReturn = new Array();
            var userGames = this.findGamesByUser(user);
            for(var i = 0; i < userGames.length; i++) {
                var game = userGames[i];
                var clientHadGame = false;
                for(var j = 0; j < currentGames.length; j++) {
                    var currentGame = currentGames[j];
                    if(game.gameID === currentGame.gameID) {
                        clientHadGame = true;
                        // check if user is in game and that
                        if(game.turn > currentGame.turn) {
                            console.log("Pushing game with newer turn");
                            gamesToReturn.push(game);
                        }
                    }
                }
                if(!clientHadGame) {
                    console.log("Pushing a game the client did not have");
                    gamesToReturn.push(game);
                }
            }
            return gamesToReturn;
        }

GameManager.prototype.findGameByID = function(gameID) {
            for(var i = 0; i < this.games.length; i++) {
                var game = this.games[i];
                if(game.gameID === gameID) {
                    return game;
                }
            }
            return null;
        }

GameManager.prototype.convertGameToGameData = function(user, game) {
            var opponent;
            var ourBoats;
            var ourBoatMask;
            var ourShotMask;
            var theirBoats;
            var theirBoatMask;
            var theirShotMask;
            if(game.p1user.userID === user.userID) {
                // we are user 1
                ourBoats = game.p1Boats;
                ourBoatMask = game.p1BoatMask;
                ourShotMask = game.p1ShotMask;

                opponent = game.p2user;
                theirBoats = game.findDestroyedBoats(2);
                theirBoatMask = game.p2BoatMask;
                theirShotMask = game.p2ShotMask;
            } else {
                // we are user 2
                ourBoats = game.p2Boats;
                ourBoatMask = game.p2BoatMask;
                ourShotMask = game.p2ShotMask;

                opponent = game.p1user;
                theirBoats = game.findDestroyedBoats(1);
                theirBoatMask = game.p1BoatMask;
                theirShotMask = game.p1ShotMask;
            }
            // set their boatMask to only those that we have shot
            theirBoatMask = MaskHelper.and(theirBoatMask, theirShotMask);

            // TODO Send our boats, our shot mask, our boat mask, their shot mask, our hit mask
            return {
                opponent: {
                    userID: opponent.userID,
                    username: opponent.username
                },
                gameID: game.gameID,
                ourBoats: ourBoats,
                ourBoatMask: ourBoatMask,
                ourShotMask: ourShotMask,
                theirBoats: theirBoats,
                theirBoatMask: theirBoatMask,
                theirShotMask: theirShotMask
            };
        }

exports.GameManager = GameManager;
