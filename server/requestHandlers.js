var exec = require("child_process").exec;
var querystring = require("querystring");
var GameManager = require("./gamemanager").GameManager;
var UserManager = require("./usermanager").UserManager;
var Game = require("./game").Game;
var Boat = require("./boat").Boat;
var User = require("./user").User;
var ObjectHelper = require("../shared/objecthelper").ObjectHelper;
var MaskHelper= require("../shared/maskhelper").MaskHelper;

var defaultHeader = "text/plain\nAccess-Control-Allow-Origin: *";

var userManager;
var gameManager;

// TODO Should be initialized elsewhere?
userManager = new UserManager();
gameManager = new GameManager(userManager);

function newUser(response, postData) {

    //var test = JSON.parse(postData);
    console.log("data: ");
    console.log(querystring.parse(postData));
    console.log("Request handler 'newUser' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    var user = userManager.addUser();
    console.log(JSON.stringify(user));
    response.write(JSON.stringify(user));
    response.end();
}

function shoot(response, postData) { //var params = { user: user.userID, key: user.key, gameID: game.gameID, tile: index };
    console.log("Request handler 'shoot' was called.");
    response.writeHead(200, { "Content-Type": defaultHeader });
    var data = JSON.parse(post.json);

    var game = gameManager.findGameByID(data.gameID);

    var gameData = { success: false, index: data.index, boat: false };

    //Do mandatory checks

    var user = userManager.findUserByID(data.user.userID);
    if (game !== null /*&& auth */) {
     
        var pI = game.getIndexOfUser(user);
        var oppI = (pI === 1) ? 0 : 1;

        if (user === game.players[pI].user /* in case it returns the p2 and it aint equal*/
        && (data.index < game.nRows * game.nCols) && (data.index >= 0) && !isNaN(parseInt(data.index * 1)) /*the index is valid*/
        && !MaskHelper.getValueOfIndex(game.players[oppI].shotMask, data.index)
        && game.currentPlayer === user /*users turn*/
        && MaskHelper.getValueOfIndex(game.player[oppI].shotMask, data.index) /*the tile hasn't already been shot at*/) {
            //TODO: check if it was the users turn (and alt. ammo.
            gameData.success = true;

            //fire the cannons!
            MaskHelper.setIndex(game.players[oppI].shotMask, data.index);

            //Remove ammo from the user.
            remainingShots--;
            gameData.remainingShots = remainingShots;

            if (remainingShots === 0)
                game.currentPlayer = game.players[oppI].user;

            if (MaskHelper.getValueOfIndex(game.player[oppI].boatMask, data.index)) {
                gameData.boat = true; //"the tile contains a boat"

                if (MaskHelper.compare(MaskHelper.and(game.players[oppI].boatMask, game.players[oppI].shotMask),game.players[oppI].boatMask)) { //check if the game is over
                    game.winner = user;
                }

                var boat = null;
                for (var i = 0; i < game.players[oppI].boats.length; i++) {
                    if (MaskHelper.getValueOfIndex(game.players[oppI].boats[i].boatMask, data.index)) {
                        boat = game.players[oppI].boats[i];
                        break;
                    }
                }
                var bm = boat.mask(game.nRows, game.nCols);
                if (MaskHelper.compare(MaskHelper.and(bm, game.players[oppI].shotMask),bm)) {
                    gameData.newBoatSunk = boat;
                }
            }
        }     
    }
    response.write(JSON.stringify(gameData));
    response.end();    
}

function randomGame(response, postData) {
    console.log("Request handler 'randomGame' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    console.log("Received post data: " + postData);

    //var post = querystring.parse(postData);
    var receivedData = JSON.parse(postData);
    var receivedUser = receivedData.user;
    // TODO authenticate
    console.log("Looking up user with ID " + receivedUser.userID);
    var user = userManager.findUserByID(receivedUser.userID);
    console.log("Found user with ID " + user.userID);
    if(user === null) {
        response.write("ERROR user not found");
        response.end();
        return;
    }
    var game = gameManager.randomGame(user);
    var gameData = Game.convertGameToGameData(user, game);
    console.log("Writing random game: " + JSON.stringify(gameData));
    response.write(JSON.stringify(gameData));
    response.end();
}

function placeBoats(response, postData) {
    console.log("Request handler 'placeBoats' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});

    //var post = querystring.parse(postData);
    var receivedData = JSON.parse(postData);
    var receivedUser = receivedData.user;
    // TODO authenticate
    console.log("Looking up user with ID " + receivedUser.userID);
    var user = userManager.findUserByID(receivedUser.userID);
    console.log("Found user with ID " + user.userID);
    if(user === null) {
        response.write("ERROR user not found");
        response.end();
        return;
    }
    var game = gameManager.findGameByID(receivedData.gameID);
    if(game.hasUser(user)) {
        var playerIndex = game.getIndexOfUser(user);
        var player = game.players[playerIndex];
        player.boatMask = game.emptyMask();
        // TODO validate that the length of the boat array is the same
        for(var i = 0; i < receivedData.ourBoats.length; i++) {
            var boat = player.boats[i];
            ObjectHelper.copyDataToObject(receivedData.ourBoats[i], boat, ["index", "size", "horizontal"]);
            player.boatMask = MaskHelper.or(player.boatMask, boat.mask(game.nRows, game.nCols));
        }
        console.log("Boat mask is now " + player.boatMask);
        // TODO validate new boat positions
        var validSetup = true;
        if(validSetup) {
            game.turn += 1;
            player.boatsPlaced = true;
        }
    } // TODO Failure of finding user in game
    // Send the game data back to the client
    var gameData = Game.convertGameToGameData(user, game);
    console.log("Writing back game data " + JSON.stringify(gameData));
    response.write(JSON.stringify(gameData));
    response.end();
}

function placeBomb(response, postData) {
    console.log("Request handler 'placeBomb' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    response.write("Return GameState!");
    response.end();
}

function status(response, postData) {
    console.log("Request handler 'start' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    response.write("Users (test)\n\n");
    response.write(JSON.stringify(userManager.users) + "\n");
    response.write("Games\n\n");
    response.write(JSON.stringify(gameManager.games) + "\n");
    response.end();
}

// Receives a list of the current games on client.
// Returns a list of games that are updated or not on the client side
function gameList(response, postData) {
    console.log("Request handler 'gameList' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    console.log("Received post data: " + postData);

    var receivedJson = JSON.parse(postData);
    var user = userManager.findUserByID(receivedJson.user.userID);
    if(user === null) {
        response.write("ERROR user not found");
        response.end();
        return;
    }
    var gamesToReturn = gameManager.findUpdatedGames(user, receivedJson.games);
    var gamesToReturnLite = new Array();
    for(var i = 0; i < gamesToReturn.length; i++) {
        var game = gamesToReturn[i];
        var gameData = Game.convertGameToGameData(user, game);
        // TODO Send data about boats and tiles
        gamesToReturnLite.push(gameData);
    }

    response.write(JSON.stringify(gamesToReturnLite));
    console.log("Writing gameList: " + JSON.stringify(gamesToReturnLite));
    response.end();
}

exports.newUser = newUser;
exports.randomGame = randomGame;
exports.placeBoats = placeBoats;
exports.placeBomb = placeBomb;
exports.status = status;
exports.gameList = gameList;
exports.shoot = shoot;
