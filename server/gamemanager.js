var Game = require("./game").Game;

function GameManager(userManager) {
    this.games = new Array();
    this.waitingGame = new Array();
    this.currentGameID = 0;
    this.userManager = userManager;
}

GameManager.prototype.addGame = function(user) {
            var game = new Game();
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
GameManager.prototype.gameList = function(user) {
            var gamesToReturn = new Array();
            for(var i = 0; i < this.games.length; i++) {
                var game = this.games[i];
                if(game.hasUser(user)) {
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

exports.GameManager = GameManager;
