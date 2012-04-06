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

function randomGame(response, postData) {
    console.log("Request handler 'randomGame' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    console.log("Received post data: " + postData);

    var post = querystring.parse(postData);
    var receivedUser = JSON.parse(post.json);
    // TODO authenticate
    var user = userManager.findUserByID(receivedUser.userID);
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

    var post = querystring.parse(postData);
    var receivedJson = JSON.parse(post.json);
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
