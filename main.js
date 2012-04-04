var menuState = 0; // 0 - game menu, 1 - our table, 2 - their table
var gameState = 0; // 0 - place boats, 1 - waiting for opponent, 2 - your turn, 3 - their turn
var canvas;
var ctx;
var tileSize = 50;
var tileMargin = 10;
var nRows = 8;
var nCols = 8;
var nBoats = 5;
var ourTiles = new Array();
var theirTiles = new Array();
var ourBoats = new Array();
var theirBoats = new Array();

var servOurTiles = new Array();
var servTheirTiles = new Array();
var servOurBoats = new Array();
var servTheirBoats = new Array();

var myUser;
var currentGameIndex = 0;

var games = new Array();

var isDragging = -1;

var serverUrl = "localhost:80";

//var mousePos = new Array();

var xmlHttpRequest;

function main() {

    myUser = new User();

    // TODO Only request new user if we're not yet registered
    requestNewUser();

    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        
        // set up UI stuff
        tileSize = canvas.width / (nCols + 2);

        canvas.addEventListener("mousemove",canvasMouseMove);
        canvas.addEventListener("mousedown",canvasMouseDown);
        canvas.addEventListener("mouseup",canvasMouseUp);
        for(var i = 0; i < nRows * nCols; i++) {
            ourTiles[i] = new Tile(i);
            theirTiles[i] = new Tile(i);
            servOurTiles[i] = new Tile(i);
            servTheirTiles[i] = new Tile(i);
        }
        for(var i = 0; i < nBoats; i++) {
            switch(i) {
            case 0:
            case 1:
                size = 2;
                break;
            case 2:
            case 3:
                size = 3;
                break;
            case 4:
                size = 4;
                break;
            }

            ourBoats[i] = new Boat(size);
            ourBoats[i].setIndex(i);
        }
	
        showMenu();
    }
}

function requestNewUser() {
    console.log("Requesting!");
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", "http://" + serverUrl + "/newUser", true);
    xmlHttpRequest.onreadystatechange = receivedNewUser;
    xmlHttpRequest.send();
}

function receivedNewUser() {
    console.log("State changed " + xmlHttpRequest.status + " " + xmlHttpRequest.responseText);
    if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
        var receivedUser = JSON.parse(xmlHttpRequest.responseText);
        myUser.userID = receivedUser.userID
        myUser.username = receivedUser.userID
        myUser.password = receivedUser.password
    }
}

function getDataFromServer() {
    // server sends back the data

    var dataStringOur = JSON.stringify(servOurTiles);
    updateTiles(dataStringOur, ourTiles);

    var dataStringTheir = JSON.stringify(servTheirTiles);
    updateTiles(dataStringTheir, theirTiles);

    // draw everything again
    drawMap();
}

function updateTiles(dataString, localTiles) {
    console.log(dataString);
    var serverTiles = JSON.parse(dataString, parseCast);

    // we update our tiles with the ones from the server
    for(var i = 0; i < serverTiles.length; i++) {
        var serverTile = serverTiles[i];
        localTiles[serverTile.index].isHit = serverTile.isHit;
        localTiles[serverTile.index].isBoat = serverTile.isBoat;
    }
}

function sendBoatsToServer() {
    // send boats to server
    // server updates the data
    for(var i = 0; i < nBoats; i++) {
        var boat = ourBoats[i];
        var index = boat.index;
        for(var j = 0; j < boat.size; j++) {
            var tileIndex;
            if(boat.horizontal) {
                tileIndex = index + j;
            } else {
                tileIndex = index + j * nCols;
            }
            console.log(tileIndex);

            servTheirTiles[tileIndex].isBoat = true;
        }
    }
    // server sends back the data
    getDataFromServer();
}

function shootTile(index) {
    // send index to server
    // server updates the data
    servTheirTiles[index].isHit = true;
    // server sends back the data
    getDataFromServer();
}

var parseCast = function (key, value) {
    var type;
    if (value && typeof value === 'object') {
        type = value.type;
        if (typeof type === 'string' && typeof window[type] === 'function') {
            return new (window[type])(value);
        }
    }
    return value;
}

function receivedRandomGame(responseText) {
    console.log(responseText);
    var gameData = JSON.parse(responseText);
    var game = new Game();
    game.gameID = gameData.gameID;
    games.push(game);
    currentGameIndex = games.length - 1;
    menuState = 1;
    drawMap();
    // TODO Add error handling if no game received or we have timed out
}

function requestRandomGame() {
    console.log("Requesting random game");
    xmlHttpRequest = new XMLHttpRequest();
    console.log(JSON.stringify(myUser));
    var params = "json=" + JSON.stringify(myUser);
    $.post("http://" + serverUrl + "/randomGame", params, receivedRandomGame);
//    xmlHttpRequest.open("POST", "http://" + serverUrl + "/randomGame", true);
//    //Send the proper header information along with the request
//    xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//    xmlHttpRequest.setRequestHeader("Content-length", params.length);
//    xmlHttpRequest.setRequestHeader("Connection", "close");
//    // connect the ready state
//    xmlHttpRequest.onreadystatechange = receivedRandomGame;
//    xmlHttpRequest.send(params);
}


/************* DRAWING *************/

function clear() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function showMenu() {
    menuState = 0;
    ctx.fillText("Menu", 10, 10);
    ctx.fillText("Play game", 10, 40);
}

function drawMap() {
    clear();
    if(menuState == 1) {
        ctx.fillText("Mine",10,10);
    } else {
        ctx.fillText("Theirs",10,10);
    }
    ctx.fillText("GameState: " + gameState, canvas.width - 100, 10);
    ctx.fillStyle = "rgb(200,50,0)";
    ctx.fillRect(100, canvas.height-150, 200, 50);

    for(var i = 0; i < nRows * nCols; i++) {
        if(menuState == 1) {
            ourTiles[i].draw();
        } else if(menuState == 2) {
            theirTiles[i].draw();
        }
    }

    for(var i = 0; i < nBoats; i++) {
        if(menuState == 1) {
            ourBoats[i].draw();
        } else if(menuState == 2) {
            //            theirBoats[i].draw();
        }
    }
}

/************* MOUSE HANDLING *************/

function getCursorPosition(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;

    do {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while (currentElement = currentElement.offsetParent)

    var canvasX = event.pageX - totalOffsetX;
    var canvasY = event.pageY - totalOffsetY;
    //console.log(event.pageX + " " + currentElement.offsetLeft);
    return { x: canvasX, y: canvasY }
}
//HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function canvasMouseMove(e) {

    var mousePos = getCursorPosition(e);

    if(isDragging > -1) {
        var boat = ourBoats[isDragging];
        boat.x = mousePos.x - boat.width / 2;
        boat.y = mousePos.y - boat.height / 2;
        drawMap();
    }
}

function canvasMouseUp(e) {

    var mousePos = getCursorPosition(e);
    var x = mousePos.x;
    var y = mousePos.y;

    if (menuState == 0) {
        requestRandomGame();
        
    } else if(isDragging > -1) {
        console.log("Finding best fit!");
        var boat = ourBoats[isDragging];
        var bestFit = 99999999;
        var bestFitIndex = -1;
        for(var i = 0; i < nRows * nCols; i++) {
            var diffX = ourTiles[i].x - x + boat.width / 2;
            var diffY = ourTiles[i].y - y + boat.height / 2;
            var ourFit = diffX * diffX + diffY * diffY;
            if(ourFit < bestFit) {
                bestFit = ourFit;
                bestFitIndex = i;
            }
        }
        boat.setIndex(bestFitIndex);
    } else {

        for(var i = 0; i < nRows * nCols; i++) {
            if(menuState == 1) {
                ourTiles[i].isClicked(x,y);
            } else if(menuState == 2) {
                ourTiles[i].isClicked(x,y);
            }
        }

        if (menuState == 1 || menuState == 2) {
            if (x > 150 && x < 150+200 && y >  canvas.height-150 && y <  canvas.height-150 +50) {
                switch(gameState) {
                case 0:
                    // TODO it is not automatically our turn! Wait for data from server.
                    sendBoatsToServer();
                    gameState = 2;
                    menuState = 2;
                    break;
                case 1:
                    if (menuState==2) {
                        menuState=1;
                    } else {
                        menuState =2;
                    }
                    break;
                case 2:
                    if (menuState==2) {
                        menuState=1;
                    } else {
                        menuState =2;
                    }
                    break;
                case 3:
                    break;
                }
                console.log("State " + menuState);

                drawMap();
            }

        }
    }
    isDragging = -1;
    drawMap();
}

function canvasMouseDown(e) {
    var mousePos = getCursorPosition(e);

    if (menuState == 1 && gameState == 0) {
        console.log("spotted " + nBoats + "boats. With mouse coord: " + mousePos.x + "," + mousePos.y);
        for(var i = 0; i < nBoats; i++) {
            if (ourBoats[i].isClicked(mousePos.x, mousePos.y)) {
                console.log("boat clicked!!");
                isDragging = i;
            }
        }
    }
}
