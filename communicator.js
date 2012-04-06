function Communicator() {
    this.serverUrl = "url not defined";
    this.receivedUserCallback = 0;
    this.receivedRandomGameCallback = 0;
    this.defaultTimeout = 10000;
    this.requestUserTimeout = null;
}

// Stops all communication and timeouts
Communicator.prototype.stopAll = function() {
            // clear all timeouts
            clearTimeout(this.requestUserTimeout);
            // TODO any way to stop other communication? (not critical)
        }

Communicator.prototype.requestNewUser = function(callback) {
            var self = this;
            this.receivedUserCallback = callback;
            $.post("http://" + this.serverUrl + "/newUser", "", function(responseText) { self.receivedNewUser(responseText, callback); });
            // time out after x seconds
            this.requestUserTimeout = setTimeout(function() {self.receivedNewUser("timeout", callback)}, this.defaultTimeout);
        }

Communicator.prototype.receivedNewUser = function(responseText, callback) {
            clearTimeout(this.requestUserTimeout);
            if(responseText === "timeout") {
                console.log("Timed out request!");
                callback(408,0); // send timed out (HTTP) status code and no user
                return;
            }
            // TODO Error handling if user could not be created
            var receivedUser = JSON.parse(responseText);
            var myUser = new User();
            myUser.userID = receivedUser.userID;
            myUser.username = receivedUser.userID;
            myUser.password = receivedUser.password;
            callback(0, myUser);
        }

Communicator.prototype.requestRandomGame = function(user, callback) {
            var self = this;
            console.log("Requesting random game");
            var params = "json=" + JSON.stringify(user);
            $.post("http://" + this.serverUrl + "/randomGame", params, function(responseText) { self.receivedRandomGame(responseText, callback); });
        }

Communicator.prototype.receivedRandomGame = function(responseText, callback) {
            console.log("Received random game!");
            var gameData = JSON.parse(responseText);
            var game = new Game();
            game.gameID = gameData.gameID;
            // TODO Process game data
            console.log(gameData);
            // TODO Add error handling if no game received or we have timed out
            callback(0, game);
        }

Communicator.prototype.requestGameList = function(user, games, callback) {
            var self = this;
            console.log("Requesting game list by sending " + games.length + " games");
            var gamesToRequests = new Array();
            for(var i = 0; i < games.length; i++) {
                var game = games[i];
                gamesToRequests.push({
                                         turn: game.turn,
                                         gameID: game.gameID
                                     });
            }
            console.log("Requesting " + gamesToRequests.length + " games")
            var params = "json=" + JSON.stringify({user: user, games: gamesToRequests});
            $.post("http://" + this.serverUrl + "/gameList", params, function(responseText) { self.receivedGameList(responseText, callback); });

        }

Communicator.prototype.receivedGameList = function(responseText, callback) {
            console.log("Received game list!");
            var gamesData = JSON.parse(responseText);
            var games = new Array();
            for(var i = 0; i < gamesData.length; i++) {
                var gameData = gamesData[i];
                var game = new Game();
                game.gameID = gameData.gameID;
                games.push(game);
            }
            // TODO Add error handling if no game received or we have timed out
            callback(0, games);
        }
