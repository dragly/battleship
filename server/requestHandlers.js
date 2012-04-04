var exec = require("child_process").exec;
var querystring = require("querystring");

var currentUserID = 0;
var currentGameID = 0;
var users = new Array();
var games = new Array();
var waitingGame = new Array();

function Boat() {
    this.index = 0;
}

function User() {
    this.userID = "";
    this.username = "";
    this.password = "";
}

function Game() {
    this.gameID = "";
    this.turn = 0;
    this.currentPlayer = 0;
    this.nRows = 8;
    this.nCols = 8;
    this.p1user = 0;
    this.p2user = 0;
    this.p1Boats = new Array();
    this.p2Boats = new Array();
    this.p1BoatMask = new Array();
    this.p2BoatMask = new Array();
    this.p1HitMask = new Array();
    this.p2HitMask = new Array();
}

function newUser(response, postData) {
    console.log("Request handler 'newUser' was called.");
    response.writeHead(200, {"Content-Type": "text/plain\nAccess-Control-Allow-Origin: *"});
    var user = new User();
    user.userID = currentUserID;
    user.password = "12345";
    users[currentUserID] = user;
    response.write(JSON.stringify(user));
    response.end();
    currentUserID ++;
}

function randomGame(response, postData) {
    console.log("Request handler 'randomGame' was called.");
    response.writeHead(200, {"Content-Type": "text/plain\nAccess-Control-Allow-Origin: *"});
    console.log("Received post data: " + postData);

    var post = querystring.parse(postData);
    var receivedUser = JSON.parse(post.json);
    if(waitingGame.length < 1) {
        console.log("Waiting game was 0");

        // TODO authenticate

        var game = new Game();
        game.p1user = users[receivedUser.userID];
        game.gameID = currentGameID;

        console.log("Made game with user " + game.p1user.password);
        response.write(JSON.stringify(game));

        games.push(game);

        waitingGame.push(game);
        currentGameID++;
    } else {
        var game = waitingGame[0];
        console.log(game);
        console.log("Adding user to game " + game.gameID);
        game.p2user = users[receivedUser.userID];
        response.write(JSON.stringify(game));
        waitingGame.pop();
    }

    response.end();
}

function placeBoats(response, postData) {
    console.log("Request handler 'placeBoats' was called.");
    response.writeHead(200, {"Content-Type": "text/plain\nAccess-Control-Allow-Origin: *"});
    response.write("Return GameState!");
    response.end();
}

function placeBomb(response, postData) {
    console.log("Request handler 'placeBomb' was called.");
    response.writeHead(200, {"Content-Type": "text/plain\nAccess-Control-Allow-Origin: *"});
    response.write("Return GameState!");
    response.end();
}

function status(response, postData) {
    console.log("Request handler 'start' was called.");
    response.writeHead(200, {"Content-Type": "text/plain\nAccess-Control-Allow-Origin: *"});
    response.write("Users (test)\n\n");
    response.write(JSON.stringify(users) + "\n");
    response.write("Games\n\n");
    response.write(JSON.stringify(games) + "\n");
    response.end();
}

exports.newUser = newUser;
exports.randomGame = randomGame;
exports.placeBoats = placeBoats;
exports.placeBomb = placeBomb;
exports.status = status;
