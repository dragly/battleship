function Communicator(mainMenu) {
    this.serverUrl = "url not defined";
    this.mainMenu = mainMenu;
}

Communicator.prototype.errorHandler = function(request,status,err) {
    //handle timeout here, do a popup or smth fancy!
    if (status == "timeout") {
        console.log("ERROR 408: Request timed out!");
    } else {
        console.log(status);
    }     
    //if ( status == "error" ) {
    //} else if ( status == "abort" ) {
    //}
}

Communicator.prototype.ajaxCall = function(url,callback, data) {
    var self = this;
        
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        timeout: 5000,
        success: function(response) { callback(response); },
        error: function (request, status, err) { self.errorHandler(request,status,err); },
        dataType: "json"
    });
}

Communicator.prototype.requestNewUser = function (callback) {
    var self = this;
    this.ajaxCall("http://" + this.serverUrl + "/newUser", function(response) { self.receivedNewUser(response, callback); });
}

Communicator.prototype.receivedNewUser = function (receivedUserData, callback) {

    //TODO Error handling if user could not be created
    var myUser = new User();
    myUser.userID = receivedUserData.userID;
    myUser.username = receivedUserData.userID;
    myUser.password = receivedUserData.password;
    callback(myUser);
}

Communicator.prototype.recievedShootTile = function (gameData, callback) {
    var self = this;
    callback(gameData.success,gameData.index,gameData.boat, gameData.newBoatSunk);
}

Communicator.prototype.requestShootTile = function (user, game, index, callback) {
    var self = this;
    var params = { user: user.userID, key: user.key, gameID: game.gameID, tile: index };
    this.ajaxCall("http://" + this.serverUrl + "/shoot", function (response) { self.receivedShootTile(response, callback); }, params);
}

Communicator.prototype.requestRandomGame = function (user, callback) {
    var self = this;
    console.log("Requesting random game");
    var params = "json=" + JSON.stringify(user);
    this.ajaxCall("http://" + this.serverUrl + "/randomGame", function (response) { self.receivedRandomGame(response, callback); }, params);
}

Communicator.prototype.receivedRandomGame = function (gameData, callback) {
    console.log("Received random game!");
    var game = new Game();
    game.gameID = gameData.gameID;
    // TODO Process game data
    console.log(gameData);
    // TODO Add error handling if no game received or we have timed out
    callback( game);
}

Communicator.prototype.requestGameList = function (user, callback) {
    var self = this;
    console.log("Requesting game list");
    var params = "json=" + JSON.stringify(user);
    this.ajaxCall("http://" + this.serverUrl + "/gameList", function (response) { self.receivedGameList(response, callback); },params);
}

Communicator.prototype.receivedGameList = function (gameData, callback) {
    console.log("Received game list!");
    var games = new Array();
    for (var i = 0; i < gamesData.length; i++) {
        var gameData = gamesData[i];
        var game = new Game();
        game.gameID = gameData.gameID;
        games.push(game);
    }
    // TODO Add error handling if no game received or we have timed out
    callback(games);
}
