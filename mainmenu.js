var tileSize = 50;
var tileMargin = 10;
var nRows = 8;
var nCols = 8;
var nBoats = 5;
var ourTiles = new Array();
var theirTiles = new Array();
var ourBoats = new Array();
var theirBoats = new Array();

//var servOurTiles = new Array();
//var servTheirTiles = new Array();
//var servOurBoats = new Array();
//var servTheirBoats = new Array();

var games = new Array();

var GameState = {
    PlaceBoats: 0,
    Waiting: 1,
    OurTurn: 2,
    TheirTurn: 3
}
var MenuState = {
    List: 0,
    Ours: 1,
    Theirs: 2,
    Login: 3
}

function MainMenu() {
    this.mouseHelper = new MouseHelper();
    this.communicator = new Communicator();
    this.communicator.serverUrl = "localhost:8888";
    this.menuState = MenuState.Login; // 0 - game menu, 1 - our table, 2 - their table, 3 - login user
    this.gameState = GameState.PlaceBoats; // 0 - place boats, 1 - waiting for opponent, 2 - your turn, 3 - their turn
    this.canvas = 0;
    this.ctx = 0;
    this.user = null;
    this.isDragging = -1;
    //Buttons
    var self = this;
    this.buttonHandler = new ButtonHandler();

    this.newUserButton = new Button(200, 50, 100, 300, "Create new user", function () { self.requestNewUser() }); // <3 jallascript
    this.buttonHandler.addButton(this.newUserButton);
}
MainMenu.prototype.clear = function() {
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        }

// Initialize everything. Check for user id. Load settings.
MainMenu.prototype.initApplication = function() {
    this.canvas = document.getElementById("canvas");
    if(!this.canvas.getContext) {
        console.log("ERROR: Could not find canvas!");
        return;
    }
    this.ctx = this.canvas.getContext("2d");

    var self = this;
    this.canvas.addEventListener("mousemove", function(event) {self.canvasMouseMove(event)});
    this.canvas.addEventListener("mousedown", function(event) {self.canvasMouseDown(event) });
    this.canvas.addEventListener("mouseup", function(event) {self.canvasMouseUp(event)});

    // TODO setting up tilesize should be done elsewhere and not in a global var
    // set up UI stuff
    tileSize = this.canvas.width / (nCols + 2);

    // TODO add check if user exists already. We presume now that no user is created.
    if(this.user === null) {
        this.showLoginScreen();
    }
}

MainMenu.prototype.showLoginScreen = function () {
    this.menuState = MenuState.Login;

    this.buttonHandler.hideAll();
    this.newUserButton.show();

    this.redraw();
}

MainMenu.prototype.showGameList = function() {
    this.menuState = MenuState.List;

    this.buttonHandler.hideAll();

    this.redraw();
}

MainMenu.prototype.requestNewUser = function() {
            var self = this;
            // TODO add this to the communicator class
            this.communicator.requestNewUser(function(statusCode, user) {self.receivedNewUser(statusCode, user)});
}
MainMenu.prototype.receivedNewUser = function(statusCode, user) {
    console.log("I was called back with status code " + statusCode);
    if(statusCode === 408) {
        console.log("Timed out requesting user...");
    }
    if(statusCode === 0) {
        console.log("A new user was returned successfully!");
        this.user = user;
        console.log(this.isDragging);
        this.showGameList();
    }
}
MainMenu.prototype.showGame = function(game) {
            // TODO implement this
            console.log("Not implemented");
            currentGame = game;
            this.menuState = 1;
            this.redraw();
        }

MainMenu.prototype.requestRandomGame = function() {
            this.communicator.requestRandomGame(function(statusCode, game) {self.receivedRandomGame(statusCode, game);});
        }
MainMenu.prototype.receivedRandomGame = function(statusCode, game) {
            console.log("Received game");
            games.push(game);
            this.showGame(game);
}

// *********** DRAWING STUFF *********** //

MainMenu.prototype.redraw = function () {
    console.log(this.menuState);
    this.clear();
    if (this.menuState === MenuState.Login) {
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillText("Login screen", 100, 100);
        //this.ctx.fillText("Click to create new user", 100, 200);
    } else if (this.menuState === MenuState.List) {
        // TODO Draw the list
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillText("Game list", 100, 100);
    } else if (this.menuState === MenuState.Ours) {
        this.ctx.fillText("Mine", 10, 10);
        // TODO Draw the board
        for (var i = 0; i < nRows * nCols; i++) {
            ourTiles[i].draw();
        }
        for (var i = 0; i < nBoats; i++) {
            ourBoats[i].draw();
        }
    } else if (this.menuState === MenuState.Theirs) {
        this.ctx.fillText("Theirs", 10, 10);
        for (var i = 0; i < nRows * nCols; i++) {
            theirTiles[i].draw();
        }
        // TODO draw hit boats
        for (var i = 0; i < nBoats; i++) {
            //                        theirboats[i].draw();
        }
    } else {
        console.log("WARNING: Unknown menu state!");
    }
    console.log("gets here");
    this.buttonHandler.draw(this.ctx);
    console.log("and here");

    this.ctx.fillText("GameState: " + this.gameState, this.canvas.width - 100, 10);
    //this.ctx.fillStyle = "rgb(200,50,0)";
    //this.ctx.fillRect(100, this.canvas.height - 150, 200, 50);
}


// *********** MOUSE HANDLING ********** //
MainMenu.prototype.canvasMouseMove = function(e) {
    var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas);

    if(this.isDragging > -1) {
        var boat = ourBoats[this.isDragging];
        boat.x = mousePos.x - boat.width / 2;
        boat.y = mousePos.y - boat.height / 2;
        this.redraw();
    }
}

MainMenu.prototype.canvasMouseUp = function (e) {

    var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas);
    var x = mousePos.x;
    var y = mousePos.y;

    if (this.menuState === MenuState.List) {
        this.requestRandomGame();
    } else if (this.menuState === MenuState.Login) {
        // this.requestNewUser();
    } else if (this.isDragging > -1) {
        console.log("Finding best fit!");
        var boat = ourBoats[this.isDragging];
        var bestFit = 99999999;
        var bestFitIndex = -1;
        for (var i = 0; i < nRows * nCols; i++) {
            var diffX = ourTiles[i].x - x + boat.width / 2;
            var diffY = ourTiles[i].y - y + boat.height / 2;
            var ourFit = diffX * diffX + diffY * diffY;
            if (ourFit < bestFit) {
                bestFit = ourFit;
                bestFitIndex = i;
            }
        }
        boat.setIndex(bestFitIndex);
    } else {

        for (var i = 0; i < nRows * nCols; i++) {
            if (this.menuState === 1) {
                ourTiles[i].isClicked(x, y);
            } else if (this.menuState === 2) {
                ourTiles[i].isClicked(x, y);
            }
        }

        if (this.menuState === 1 || this.menuState === 2) {
            if (x > 150 && x < 150 + 200 && y > canvas.height - 150 && y < canvas.height - 150 + 50) {
                switch (gameState) {
                    case 0:
                        // TODO it is not automatically our turn! Wait for data from server.
                        sendBoatsToServer();
                        gameState = 2;
                        this.menuState = 2;
                        break;
                    case 1:
                        if (this.menuState == 2) {
                            this.menuState = 1;
                        } else {
                            this.menuState = 2;
                        }
                        break;
                    case 2:
                        if (this.menuState == 2) {
                            this.menuState = 1;
                        } else {
                            this.menuState = 2;
                        }
                        break;
                    case 3:
                        break;
                }
                console.log("State " + this.menuState);

                this.redraw();
            }

        }
    }
    this.buttonHandler.mouseReleased(x,y);
    this.isDragging = -1;
    this.redraw();
}

MainMenu.prototype.canvasMouseDown = function (e) {
    var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas);

    this.buttonHandler.mousePressed(mousePos.x, mousePos.y);

    if (this.menuState == 1 && gameState == 0) {
        console.log("spotted " + nBoats + "boats. With mouse coord: " + mousePos.x + "," + mousePos.y);
        for (var i = 0; i < nBoats; i++) {
            if (ourBoats[i].isClicked(mousePos.x, mousePos.y)) {
                console.log("boat clicked!!");
                this.isDragging = i;
            }
        }
    }
}