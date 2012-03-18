var exec = require("child_process").exec;
var querystring = require("querystring");

var curUserId = 0;
var users = new Array();
var games = new Array();
var waitingGame = 0;

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
    user.userID = curUserId;
    user.password = "12345";
    users[curUserId] = user;
    response.write(JSON.stringify(user));
    response.end();
    curUserId ++;
}

function randomGame(response, postData) {
    console.log("Request handler 'randomGame' was called.");
    response.writeHead(200, {"Content-Type": "text/plain\nAccess-Control-Allow-Origin: *"});
    if(waitingGame === 0) {
        var game = new Game();

        var post = querystring.parse(postData);
        console.log(post);
        console.log(post.json);
        var receivedUser = JSON.parse(post.json);
        console.log(receivedUser.userID);
        console.log("Blah...");

        // TODO authenticate

        game.p1user = users[receivedUser.userID];

        console.log("Made game with user " + game.p1user.password);
        response.write(JSON.stringify(game));

        games.push(game);

        waitingGame = game;
    } else {

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
    response.write("Users\n\n");
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
