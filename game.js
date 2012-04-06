function Game() {
    this.gameID = 0;
    this.nRows = 8;
    this.nCols = 8;
    this.ourTiles = new Array();
    this.theirTiles = new Array();
    this.ourBoats = new Array();
    this.theirBoats = new Array();
    this.theirShotMask = new Array();
    this.ourShotMask = new Array
    this.theirBoatMask = new Array();
    this.ourBoatMask = new Array();
    this.opponent = null;
}

// Create a game based on game data from server
Game.createGameFromData = function(gameData) {
    var game = new Game();
    game.gameID = gameData.gameID;
    var opponentData = gameData.opponent;
    if(gameData.opponent !== null) {
        var opponent = new User();
        ObjectHelper.copyDataToObject(gameData.opponent, opponent, ["userID", "username"]);
        game.opponent = opponent;
    } else {
        game.opponent = null;
    }
    for(var i = 0; i < gameData.ourBoats.length; i++) {
        var boat = new Boat();
        ObjectHelper.copyDataToObject(gameData.ourBoats, boat, ["index", "horizontal", "size"]);
        game.ourBoats.push(boat);
    }
    for(var i = 0; i < gameData.theirBoats.length; i++) {
        var boat = new Boat();
        ObjectHelper.copyDataToObject(gameData.ourBoats, boat, ["index", "horizontal", "size"]);
        game.theirBoats.push(boat);
    }
    ObjectHelper.copyDataToObject(gameData, game, ["ourBoatMask","ourShotMask","theirBoatMask","theirShotMask"]);
    
    return game;
}
