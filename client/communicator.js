function Communicator(mainMenu) {
    this.serverUrl = "url not defined";
    this.mainMenu = mainMenu;
}

Communicator.prototype.errorHandler = function (request, status, err) {

    mainMenu.hideLoadingMessage();

    //handle timeout here, do a popup or smth fancy!
    if (status == "timeout") {
        console.log("ERROR 408: Request timed out!");
    } else {
        console.log(status);
    }
    mainMenu.httpError();
    //if ( status == "error" ) {
    //} else if ( status == "abort" ) {
    //}
}

Communicator.prototype.ajaxCall = function(url,callback, data) {
    var self = this;
        
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        timeout: 5000,
        success: function(response) { callback(response); },
        error: function (request, status, err) { self.errorHandler(request,status,err); },
        dataType: "json"
    });
}

Communicator.prototype.requestPlaceBoats = function (user, game, ourBoats, callback) {
    var self = this;
    var params = { user: user.authData(), ourBoats: ourBoats, gameID: game.gameID };
    this.ajaxCall("http://" + this.serverUrl + "/placeBoats", function(response) { self.receivedPlaceBoats(response, callback); }, params);
}

Communicator.prototype.receivedPlaceBoats = function (receivedData, callback) {
    //TODO Error handling if boats could not be placed
    if(receivedData.error === undefined) {
        console.log("No error");
    }

    console.log("Received data from game after placing boats");
    var game = Game.createGameFromData(receivedData)
    callback(game);
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
    mainMenu.hideLoadingMessage();

    //handle gamestate
    if (gameData.success)
        callback(gameData.index, gameData.boat, gameData.remainingShots, gameData.newBoatSunk);
    else 
        console.log("Error: Illegal shoot action!");
}


Communicator.prototype.requestShootTile = function (user, game, index, callback) {
    var self = this;
    var params = { user: user.authData(), gameID: game.gameID, tile: index };
    this.ajaxCall("http://" + this.serverUrl + "/shoot", function (response) { self.receivedShootTile(response, callback); }, params);
}

Communicator.prototype.requestRandomGame = function (user, callback) {
    var self = this;
    console.log("Requesting random game");
    var params = {user: user.authData()};
    this.ajaxCall("http://" + this.serverUrl + "/randomGame", function (response) { self.receivedRandomGame(response, callback); }, params);
}

Communicator.prototype.receivedRandomGame = function (gameData, callback) {
    console.log("Received random game!");
    var game = Game.createGameFromData(gameData)
    callback( game);
}

Communicator.prototype.requestGameList = function (user, games, callback) {
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
    var params = {user: user.authData(), games: gamesToRequests};
    this.ajaxCall("http://" + this.serverUrl + "/gameList", function (response) { self.receivedGameList(response, callback); },params);
}

Communicator.prototype.receivedGameList = function (gamesData, callback) {
    console.log("Received game list! " + gamesData);
    var games = new Array();
    for (var i = 0; i < gamesData.length; i++) {
        var gameData = gamesData[i];
        var game = Game.createGameFromData(gameData);
        console.log("Pushing game with ID " + game.gameID);
        games.push(game);
    }
    // TODO Add error handling if no game received or we have timed out
    callback(games);
}
