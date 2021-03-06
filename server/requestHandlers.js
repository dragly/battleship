var exec = require("child_process").exec;
var querystring = require("querystring");
var GameManager = require("./gamemanager").GameManager;
var UserManager = require("./usermanager").UserManager;
var Game = require("./game").Game;
var Boat = require("./boat").Boat;
var User = require("./user").User;
var ObjectHelper = require("../shared/objecthelper").ObjectHelper;
var MaskHelper= require("../shared/maskhelper").MaskHelper;

var userManager;
var gameManager;

var redis = require("redis"),
        client = redis.createClient();

// TODO Should be initialized elsewhere?
userManager = new UserManager();
gameManager = new GameManager(userManager);

function writeHeaders(response) {
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
}

function newUser(response, postData) {

    //var test = JSON.parse(postData);
    console.log("data: ");
    console.log(querystring.parse(postData));
    console.log("Request handler 'newUser' was called.");
    writeHeaders(response);
    userManager.addUser(function(user) {
        console.log("Writing back: " + JSON.stringify(user));
        console.log("Writing back userID: " + user.userID);
        response.write(JSON.stringify(user));
        response.end();
    });
}

//function userLogin(response, postData) { //Just for the user to make sure he aint connecting with a unknow
//    console.log("User sign in");

//}

function shoot(response, postData) { //var params = { user: user.userID, key: user.key, gameID: game.gameID, tile: index };
    console.log("Request handler 'shoot' was called.");
    writeHeaders(response);
    var data = JSON.parse(postData);

    var game = gameManager.findGameByID(data.gameID);

    var gameData = { success: false, index: data.index, boat: false, gameState: null };

    //Do mandatory checks

    userManager.findUserByID(data.user.userID, function(user) {
        if (game === null/* || !userManager.auth(data.user.userID,data.user.key)*/) {
            console.log("Error. Game does not exist or user not authed!");
            response.write("Error. Game does not exist or user not authed!");
            response.end();
            return;
        }

        var pI = game.getIndexOfUser(user);
        var oppI = (pI === 1) ? 0 : 1;
        gameData.success = false;
        if (user === game.players[pI].user) { /* in case it returns the p2 and it aint equal*/
            if ((data.index < game.nRows * game.nCols) && (data.index >= 0) && !isNaN(parseInt(data.index * 1)))  {/*the index is valid*/
                if( !MaskHelper.getValueOfIndex(game.players[oppI].shotMask, data.index)) {
                    if (game.currentPlayer === user) { /*users turn*/
                        if( !MaskHelper.getValueOfIndex(game.players[oppI].shotMask, data.index)) { /*the tile hasn't already been shot at*/
                            //TODO: check if it was the users turn (and alt. ammo.
                            gameData.success = true;
                        } else console.log("Tile already shot!");
                    } else console.log("Not users turn!");
                } else console.log("Value of index found!");
            } else console.log("Index invalid!");
        } else console.log("Returned but it aint equal!");
        if(gameData.success) {
            //fire the cannons!
            MaskHelper.setIndex(game.players[oppI].shotMask, data.index);

            //Remove ammo from the user.
            game.remainingShots--;
            gameData.remainingShots = game.remainingShots;

            if (game.remainingShots === 0) {
                game.currentPlayer = game.players[oppI].user;
                game.turn++;
                game.remainingShots = 5;
            }

            if (MaskHelper.getValueOfIndex(game.players[oppI].boatMask, data.index)) { // check if anything is hit
                gameData.boat = true; //"the tile contains a boat"

                if (game.findWinner() === user) { //check if the game is over
                    game.winner = user;
                    game.turn += 1;
                }

                var boat = {};
                for (var i = 0; i < game.players[oppI].boats.length; i++) {
                    if (MaskHelper.getValueOfIndex(game.players[oppI].boats[i].mask(), data.index)) { // check what boat is hit
                        boat = game.players[oppI].boats[i];
                        break;
                    }
                }
                var bm = boat.mask();
                if (MaskHelper.compare(MaskHelper.and(bm, game.players[oppI].shotMask),bm)) { // check if boat is sunk
                    gameData.newBoatSunk = boat.toBoatData();
                }
            }
        }
        gameData.gameState = game.gameState(user);

        response.write(JSON.stringify(gameData));
        response.end();
    });
}

function randomGame(response, postData) {
    console.log("Request handler 'randomGame' was called.");
    writeHeaders(response);
    console.log("Received post data: " + postData);

    //var post = querystring.parse(postData);
    var receivedData = JSON.parse(postData);
    var receivedUser = receivedData.user;
    // TODO authenticate
    console.log("Looking up user with ID " + receivedUser.userID);
    userManager.findUserByID(receivedUser.userID, function(user) {
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
    });
}

function placeBoats(response, postData) {
    console.log("Request handler 'placeBoats' was called.");
    writeHeaders(response);

    //var post = querystring.parse(postData);
    var receivedData = JSON.parse(postData);
    var receivedUser = receivedData.user;
    // TODO authenticate
    console.log("Looking up user with ID " + receivedUser.userID);
    userManager.findUserByID(receivedUser.userID, function(user) {
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

            var numBoatTiles = MaskHelper.getNumSetFlags(player.boatMask); //Used for later compare

            player.boatMask = game.emptyMask();
            // TODO validate that the length of the boat array is the same
            for(var i = 0; i < receivedData.ourBoats.length; i++) {
                var boat = player.boats[i];
                ObjectHelper.copyDataToObject(receivedData.ourBoats[i], boat, ["index", "size", "horizontal"]);
            }
            game.updateBoatMask(playerIndex);
            console.log("Boat mask is now " + player.boatMask);

            if(numBoatTiles ==  MaskHelper.getNumSetFlags(player.boatMask)) { //still the same amount of tiles set?
                game.turn += 1;
                player.boatsPlaced = true;
            }
        } // TODO Failure of finding user in game
        // Send the game data back to the client
        var gameData = Game.convertGameToGameData(user, game);
        console.log("Writing back game data " + JSON.stringify(gameData));
        response.write(JSON.stringify(gameData));
        response.end();
    });
}

function placeBomb(response, postData) {
    console.log("Request handler 'placeBomb' was called.");
    writeHeaders(response);
    response.write("Return GameState!");
    response.end();
}

function status(response, postData) {
    console.log("Request handler 'start' was called.");
    writeHeaders(response);
    response.write("Users (test)\n\n");
    response.write(userManager.users.length + "\n");
    for(var i = 0; i < userManager.users.length; i++) {
        var user = userManager.users[i];
        var userData = {};
        ObjectHelper.copyDataToObject(user, userData, ["userID", "username", "password"]);
        response.write(JSON.stringify(userData) + "\n");
    }

    response.write("Games\n\n");
    response.write(gameManager.games.length + "\n");
    for(var i = 0; i < gameManager.users.length; i++) {
        var game = userManager.users[i];
        var gameData = {};
        ObjectHelper.copyDataToObject(game, gameData, ["gameID", "turn"]);
        response.write(JSON.stringify(gameData) + "\n");
    }
    response.end();
}

// Receives a list of the current games on client.
// Returns a list of games that are updated or not on the client side
function gameList(response, postData) {
    console.log("Request handler 'gameList' was called.");
    writeHeaders(response);
    console.log("Received post data: " + postData);

    var receivedJson = JSON.parse(postData);
    userManager.findUserByID(receivedJson.user.userID, function(user) {
        if(user === null) {
            console.log("User not found!");
            response.write("ERROR user not found");
            response.end();
            return;
        }
        console.log("User found. Getting games.");
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
    });
}

exports.newUser = newUser;
exports.randomGame = randomGame;
exports.placeBoats = placeBoats;
exports.placeBomb = placeBomb;
exports.status = status;
exports.gameList = gameList;
exports.shoot = shoot;
