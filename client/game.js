var GameState = {
    PlaceBoats: 0,
    Waiting: 1,
    OurTurn: 2,
    TheirTurn: 3,
    WeWon: 4,
    TheyWon: 5
}

function Game() {
    this.gameID = 0;
    this.nRows = 8;
    this.nCols = 8;
    //this.ourTiles = new Array();
    //this.theirTiles = new Array();
    this.ourBoats = new Array();
    this.ourBoatMask = new Array();
    this.ourShotMask = new Array();
    this.theirBoats = new Array();
    this.theirBoatMask = new Array();
    this.theirShotMask = new Array();
    this.opponent = null;
    this.currentAmmo = 0;
    this.turn = 0;

    this.gameState = GameState.PlaceBoats;
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
    console.log("Received n boats " + gameData.ourBoats.length);
    for(var i = 0; i < gameData.ourBoats.length; i++) {
        var boat = new Boat();
        ObjectHelper.copyDataToObject(gameData.ourBoats[i], boat, ["index", "horizontal", "size"]);
        boat.refreshPosition(gameData.nCols);
        game.ourBoats.push(boat);
    }
    for(var i = 0; i < gameData.theirBoats.length; i++) {
        var boat = new Boat();
        ObjectHelper.copyDataToObject(gameData.theirBoats[i], boat, ["index", "horizontal", "size"]);
        boat.refreshPosition(gameData.nCols);
        game.theirBoats.push(boat);
    }
    ObjectHelper.copyDataToObject(gameData, game, ["ourBoatMask","ourShotMask","theirBoatMask","theirShotMask","nCols","nRows","gameState","turn"]);
    
    return game;
}
