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

    //TODO:process shot
    //1.check if shot was legal
    //1.1 add to shotmask

    //game.
    //check vs boatmask

    //2.progress gamestate/remove ammo
    //3.check if a boat was hit
    //  3.1 If a boat was hit, call "Boat hit logic", and end game if nececarry.
    //  3.2 send the boat element as newBoatSunk if the boat

    gameManager.findGameByID(data.gameID);
    //fire shot if legal

    var gameData = { success: true, index: data.index, boat: false };

    //var boat = boatAtIndex(data.index); //TODO, implement the following functionality.
    //if (boat.isSunk())
    //    gameData.newBoatSunk = boat;

    //(gameData.success,gameData.index,gameData.boat, gameData.newBoatSunk
    //data.gameID;
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
