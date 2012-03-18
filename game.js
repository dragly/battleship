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

var gameId;

var mousePos = new Array();

var xmlHttpRequest;

function User() {
    this.userID = 0;
    this.username = 0;
    this.password = 0;
}

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
    xmlHttpRequest.open("GET", "http://localhost:8888/newUser", true);
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

Object.prototype.clone = function() {
            var newObj = (this instanceof Array) ? [] : {};
            for (i in this) {
                if (i == 'clone') continue;
                if (this[i] && typeof this[i] == "object") {
                    newObj[i] = this[i].clone();
                } else newObj[i] = this[i]
            } return newObj;
        };

function Boat(size) {
    this.index = -1;
    this.horizontal = 0;
    this.size = size;
    this.width = 0;
    this.height = 0;
    this.setHorizontal = function(horizontal) {
             this.horizontal = horizontal;
             this.length = tileSize * this.size - tileSize * 3 / 4 + tileMargin * this.size;
             if(this.horizontal) {
                 this.width = this.length;
                 this.height = tileSize / 2;
             } else {
                 this.height = this.length;
                 this.width = tileSize / 2;
             }
         }

    this.draw = function() {
             ctx.fillStyle = "rgb(100,100,100)";
             ctx.fillRect(this.x,this.y,this.width,this.height);

         }
    this.setIndex = function(index) {
             this.index = index;
             this.column = this.index % nCols;
             this.row = Math.floor(this.index / nCols);
             this.x = tileMargin + this.column * (tileSize + tileMargin) + tileSize / 4;
             this.y = tileMargin + this.row * (tileSize + tileMargin) + tileSize / 4;
         }
    this.isClicked = function(x,y) {
             var clickedMe = x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
             return clickedMe;
         }
    this.setHorizontal(false);
}

function Tile(index) {
    this.isBoat = false;
    this.isHit = false;
    this.index = index;
    this.column = index % nCols;
    this.row = Math.floor(index / nCols);
    this.x = tileMargin + this.column * (tileSize + tileMargin);
    this.y = tileMargin + this.row * (tileSize + tileMargin);
    this.draw = function() {
             if (this.isBoat && !this.isHit)
                 ctx.fillStyle = "rgb(1,1,1)";
             else if (!this.isBoat && this.isHit)
                 ctx.fillStyle = "rgb(100,100,200)";
             else if (!this.isBoat && !this.isHit)
                 ctx.fillStyle = "rgb(0,0,200)";
             else // (this.isBoat && !this.isHit)
                 ctx.fillStyle = "rgb(200,200,0)";

             ctx.fillRect(this.x,this.y,tileSize,tileSize);
         }
    this.isClicked = function(x,y) {
             var clickedMe = x > this.x && x < this.x + tileSize && y > this.y && y < this.y + tileSize;
             if(clickedMe) {
                 console.log("You clicked " + this.index);
                 switch(gameState) {
                 case 0:
                     if(menuState == 1) {
                         placeBoat(index);
                     }

                     break;
                 case 1:
                     break;
                 case 2:
                     if(menuState == 2) {
                         shootTile(index);
                     }
                     break;
                 case 3:
                     break;
                 default:
                     break;
                 }
             }
             return clickedMe;
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

function showMenu() {
    menuState = 0;
    ctx.fillText("Menu", 10, 10);
    ctx.fillText("Play game", 10, 40);
}

function receivedRandomGame() {
    console.log("State changed " + xmlHttpRequest.status + " " + xmlHttpRequest.responseText);
    if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
        console.log(xmlHttpRequest.responseText);
        menuState = 1;
        drawMap();
    }
    // TODO Add error handling if no game received or we have timed out
}

function requestRandomGame() {
    console.log("Requesting random game");
    xmlHttpRequest = new XMLHttpRequest();
    var params = "json=" + JSON.stringify(myUser);
    xmlHttpRequest.open("POST", "http://localhost:8888/randomGame", true);
    //Send the proper header information along with the request
    xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttpRequest.setRequestHeader("Content-length", params.length);
    xmlHttpRequest.setRequestHeader("Connection", "close");
    // connect the ready state
    xmlHttpRequest.onreadystatechange = receivedRandomGame;
    xmlHttpRequest.send(params);
}

function clear() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
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

var isDragging = -1;

function canvasMouseMove(e) {
    getCursorPosition(e);
    var x = mousePos[0];
    var y = mousePos[1];
    if(isDragging > -1) {
        var boat = ourBoats[isDragging];
        boat.x = x - boat.width / 2;
        boat.y = y - boat.height / 2;
        drawMap();
    }
}

function canvasMouseUp(e) {
    getCursorPosition(e);
    var x = mousePos[0];
    var y = mousePos[1];
    if(menuState == 0) {
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
    getCursorPosition(e);
    var x = mousePos[0];
    var y = mousePos[1];
    if(menuState == 1 && gameState == 0) {
        for(var i = 0; i < nBoats; i++) {
            if(ourBoats[i].isClicked(x,y)) {
                isDragging = i;
            }
        }
    }
}

function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    mousePos[0] = x;
    mousePos[1] = y;
}
