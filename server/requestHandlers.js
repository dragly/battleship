var exec = require("child_process").exec;
var querystring = require("querystring");
var GameManager = require("./gamemanager").GameManager;
var UserManager = require("./usermanager").UserManager;
var Game = require("./game").Game;
var Boat = require("./boat").Boat;
var User = require("./user").User;

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
    var boatIsHit = false;
    var success = false;
    var game = gameManager.findGameByID(data.gameID);

    var gameData = { success: success, index: data.index, boat: boatIsHit };

    //Do mandatory checks //TODO: Add auth
    if (game !== null /*&& auth */) {
     
        var pI = game.getIndexOfUserID(data.user.userID);
        var oppI = (pI === 1) ? 0 : 1;

        if (data.user.userID === game.players[pI].user.userID /* in case it returns the p2 and it aint equal*/ 
        && (data.index < game.nRows * game.nCols) && (data.index >= 0) && !isNaN(parseInt(data.index * 1)) /*the index is valid*/
        && !MaskHelper.getValueOfIndex(game.players[oppI].shotMask, data.index)) {
            //TODO: check if it was the users turn
            success = true;
            
            //fire the cannons!
            MaskHelper.setIndex(game.players[oppI].shotMask, data.index);

            //TODO: advance the game, and remove ammo from the user

            if (MaskHelper.getValueOfIndex(game.player[oppI].boatMask, data.index)) {
                boatIsHot = true;
                //TODO: If a boat was hit, call "Boat hit logic", and end game if nececarry.

                //TODO: send the boat element as newBoatSunk if the boat is now completely covered in holes

                //TODO: implement boatAtIndex(data.index);
               // if //TODO: is boat convered in holes function.
                        //gameData.newBoatSunk = boat;
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
    var gameData = gameManager.convertGameToGameData(user, game);
    console.log("Writing random game: " + JSON.stringify(gameData));
    response.write(JSON.stringify(gameData));
    response.end();
}

function placeBoats(response, postData) {
    console.log("Request handler 'placeBoats' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    response.write("Return GameState!");
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
    response.write(JSON.stringify(users) + "\n");
    response.write("Games\n\n");
    response.write(JSON.stringify(games) + "\n");
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
        var gameData = gameManager.convertGameToGameData(user, game);
        // TODO Send data about boats and tiles
        gamesToReturnLite.push(gameData);
    }

    response.write(JSON.stringify(gamesToReturnLite));
    console.log("Writing: " + JSON.stringify(gamesToReturnLite));
    response.end();
}

exports.newUser = newUser;
exports.randomGame = randomGame;
exports.placeBoats = placeBoats;
exports.placeBomb = placeBomb;
exports.status = status;
exports.gameList = gameList;
exports.shoot = shoot;
