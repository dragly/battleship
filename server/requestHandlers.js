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
    response.write(JSON.stringify(game));
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

function gameList(response, postData) {
    console.log("Request handler 'gameList' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    console.log("Received post data: " + postData);

    var post = querystring.parse(postData);
    var receivedUser = JSON.parse(post.json);
    var user = userManager.findUserByID(receivedUser.userID);
    if(user === null) {
        response.write("ERROR user not found");
        response.end();
        return;
    }

    var gamesToReturn = gameManager.gameList(user);
    var gamesToReturnLite = new Array();
    for(var i = 0; i < gamesToReturn.length; i++) {
        var game = gamesToReturn[i];
        gamesToReturnLite.push({
                                   turn: game.turn,
                                   gameID: game.gameID
                               });
    }

    response.write(JSON.stringify(gamesToReturnLite));
    console.log("Writing: " + JSON.stringify(gamesToReturnLite));
    response.end();
}

function game(response, postData) {
    console.log("Request handler 'game' was called.");
    response.writeHead(200, {"Content-Type": defaultHeader});
    console.log("Received post data: " + postData);

    var post = querystring.parse(postData);
    var receivedJson = JSON.parse(post.json);
    // TODO Authenticate
    var user = userManager.findUserByID(receivedJson.user.userID);
    var game = gameManager.findGameByID(receivedJson.game.gameID);

    // TODO Proper error handling
    if(user === null) {
        response.write("ERROR user not found");
        response.end();
        return;
    }
    if(game === null) {
        response.write("ERROR game not found");
        response.end();
        return;
    }

    response.write(JSON.stringify(game));
    console.log("Writing: " + JSON.stringify(gamesToReturnLite));
    response.end();
}

exports.newUser = newUser;
exports.randomGame = randomGame;
exports.placeBoats = placeBoats;
exports.placeBomb = placeBomb;
exports.status = status;
exports.gameList = gameList;
exports.game = game;
