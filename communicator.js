function Communicator() {
    this.serverUrl = "url not defined";
    this.receivedUserCallback = 0;
    this.receivedRandomGameCallback = 0;
    this.defaultTimeout = 10000;
    this.requestUserTimeout = 0;
}

Communicator.prototype.requestNewUser = function(callback) {
            var self = this;
            this.receivedUserCallback = callback;
            $.post("http://" + this.serverUrl + "/newUser", "", function(responseText) { self.receivedNewUser(responseText, callback); });
            // time out after x seconds
            this.requestUserTimeout = setTimeout(function() {this.receivedNewUser("timeout")}, this.defaultTimeout);
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

Communicator.prototype.requestRandomGame = function(callback) {
            console.log("Requesting random game");
            var params = "json=" + JSON.stringify(myUser);
            $.post("http://" + serverUrl + "/randomGame", params, function(responseText, callback) {receivedRandomGame(responseText, callback); });
        }

Communicator.prototype.receivedRandomGame = function(responseText, callback) {
            console.log(responseText);
            var gameData = JSON.parse(responseText);
            var game = new Game();
            game.gameID = gameData.gameID;
            // TODO Add error handling if no game received or we have timed out
            callback(0, game);
        }