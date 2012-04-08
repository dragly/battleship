var tileSize = 50;
var tileMargin = 0;

//var servOurTiles = new Array();
//var servTheirTiles = new Array();
//var servOurBoats = new Array();
//var servTheirBoats = new Array();

var games = new Array();

var MenuState = {
    List: 0,
    Ours: 1,
    Theirs: 2,
    Login: 3
}

function MainMenu() {
    this.mouseHelper = new MouseHelper();
    this.communicator = new Communicator(this);
    this.gameList = new GameList(this);
    this.communicator.serverUrl = "localhost:8888"; // "192.168.1.105:8888";
    this.menuState = MenuState.Login; // 0 - game menu, 1 - our table, 2 - their table, 3 - login user
//    this.gameState = GameState.PlaceBoats; // 0 - place boats, 1 - waiting for opponent, 2 - your turn, 3 - their turn
    this.canvas = 0;
    this.ctx = 0;
    this.user = null;
    this.draggedBoat = null;
    this.mouseDown = false;
    this.currentGame = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this.crosshairIndex = -1;
    this.refreshGamesTimeout = null;
    this.draggedBoatHasRotated = false;

    //Buttons
    var self = this;
    this.buttonHandler = new ButtonHandler();

    //    this.newUserButton = new Button(this.buttonHandler, 100, 300, 200, 50, "Create new user", function () { self.requestNewUser() }); // <3 jallascript
    //    this.newRandomGameButton = new Button(this.buttonHandler, 100, 400, 200, 50, "New Random Game", function () { self.requestRandomGame() });
    this.placeBoatsButton = new Button(this.buttonHandler, 100, 400, 200, 50, "Place boats", function () { self.requestPlaceBoats() });
    this.goToGameListButton = new Button(this.buttonHandler, 100, 500, 200, 50, "Exit to Game List", function () { self.showGameList() });
    this.switchBoardsButton = new Button(this.buttonHandler, 100, 400, 200, 50, "Switch board", function () { self.switchBoards() });
    this.shootButton = new Button(this.buttonHandler, 100, 450, 200, 50, "Fire!", function () { self.requestShootAtTile() });

    // Set up JQuery mobile
    $(document).bind("mobileinit", function () {
        $.extend($.mobile, {
            defaultPageTransition: 'none',
            defaultDialogTransition: 'none'
        });
    });
}

// Initialize everything. Check for user id. Load settings.
MainMenu.prototype.initApplication = function () {
    this.canvas = document.getElementById("canvas");
    if (!this.canvas.getContext) {
        console.log("ERROR: Could not find canvas!");
        return;
    }
    this.ctx = this.canvas.getContext("2d");

    var self = this;

    this.canvas.addEventListener("mousemove", function (event) { self.canvasMouseMove(event) });
    this.canvas.addEventListener("mousedown", function (event) { self.canvasMouseDown(event) });
    this.canvas.addEventListener("mouseup", function (event) { self.canvasMouseUp(event) });
    this.canvas.addEventListener('touchmove', function (event) { event.preventDefault(); self.canvasMouseMove(event); });
    this.canvas.addEventListener('touchstart', function (event) { event.preventDefault(); self.canvasMouseDown(event); });
    this.canvas.addEventListener('touchend', function (event) { event.preventDefault(); self.canvasMouseUp(event); });

    // TODO setting up tilesize should be done elsewhere and not in a global var
    // set up UI stuff
    //    tileSize = this.canvas.width / (nCols + 2);

    // TODO add check if user exists already. We presume now that no user is created.
    if (this.user === null) {
        this.showLoginScreen();
    }
    // Set canvas to fullscreen (minus some UI stuff)
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight - 5;
}

MainMenu.prototype.beginRefreshGameList = function() {
    if(this.user !== null) {
        console.log("Refreshing game list!");

        this.requestGameList();

        var self = this;
        this.refreshGamesTimeout = setTimeout(function() {self.beginRefreshGameList();}, 10000);
    }
}


// TODO figure out how errors should be handled from communicator to the main menu
MainMenu.prototype.httpError = function () {
    this.hideLoadingMessage();
    console.log("Received HTTP error!");
    //    this.communicator.stopAll();
    alert("Could not connect to the game server. Please try again later.");
}

MainMenu.prototype.hideLoadingMessage = function () {
    $.mobile.hidePageLoadingMsg();
}

MainMenu.prototype.showLoadingMessage = function (message) {
    $.mobile.loadingMessage = message;
    $.mobile.showPageLoadingMsg("a", message, false);
}

MainMenu.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

//set crosshair index
MainMenu.prototype.setCrosshairIndex = function () {

    var bestFit = 99999999;
    var bestFitIndex = 0;
    for (var i = 0; i < this.currentGame.nRows; i++) {
        for (var j = 0; j < this.currentGame.nCols; j++) {
            var index = i * this.currentGame.nCols + j;
            var diffX = j * tileSize - this.lastPosX + tileSize / 2;
            var diffY = i * tileSize - this.lastPosY + tileSize / 2;
            var ourFit = diffX * diffX + diffY * diffY;
            if (ourFit < bestFit) {
                bestFit = ourFit;
                bestFitIndex = index;
            }
        }
    }
    if (bestFit < tileSize / 2 * tileSize / 2 + tileSize / 2 * tileSize / 2)
        this.crosshairIndex = bestFitIndex;
}

MainMenu.prototype.switchBoards = function() {
    if(this.menuState === MenuState.Theirs) {
        this.showOurBoard();
    } else if(this.menuState === MenuState.Ours) {
        this.showTheirBoard();
    }
}

MainMenu.prototype.showOurBoard = function() {
    this.menuState = MenuState.Ours;
    // Decide what buttons to show
    this.buttonHandler.hideAll();
    this.goToGameListButton.show();
    if(this.currentGame.gameState === GameState.PlaceBoats) {
        this.placeBoatsButton.show();
    } else {
        this.switchBoardsButton.show();
    }

    this.redraw();
    $.mobile.changePage("#gamePage");
}

MainMenu.prototype.showTheirBoard = function () {
    this.crosshairIndex = -1;
    this.menuState = MenuState.Theirs;
    // Decide what buttons to show
    this.buttonHandler.hideAll();
    this.goToGameListButton.show();
    this.switchBoardsButton.show();

    if (this.currentGame.gameState === GameState.OurTurn)
        this.shootButton.show();

    this.redraw();
    $.mobile.changePage("#gamePage");
}
MainMenu.prototype.showLoginScreen = function () {
    this.hideLoadingMessage();
    this.menuState = MenuState.Login;
    this.user = null;
    clearTimeout(this.refreshGamesTimeout);
    this.buttonHandler.hideAll();
    //    this.newUserButton.show();

    this.redraw();
    $.mobile.changePage("#loginPage");
}

MainMenu.prototype.showGameList = function () {
    this.menuState = MenuState.List;
//    this.requestGameList();

    this.buttonHandler.hideAll();
    //    this.newRandomGameButton.show();

    this.redraw();
    $.mobile.changePage("#gameListPage");
}

// TODO Impletement showWeWon
MainMenu.prototype.showWeWon = function () {
    this.buttonHandler.hideAll();
    this.goToGameListButton.show();
    this.switchBoardsButton.show();
}

// TODO Impletement showTheyWon
MainMenu.prototype.showTheyWon = function () {
    this.buttonHandler.hideAll();
    this.goToGameListButton.show();
    this.switchBoardsButton.show();
}

MainMenu.prototype.showGameByID = function (gameID) {
    for (var i = 0; i < this.gameList.games.length; i++) {
        var game = this.gameList.games[i];
        console.log("Comparing " + game.gameID + " with " + gameID);
        if (game.gameID === gameID) {
            this.showGame(game);
            return;
        }
    }
}

MainMenu.prototype.showGame = function (game) {
    // TODO implement this
            console.log("Showing game with ID " + game.gameID + " and game state " + game.gameState);
    this.currentGame = game;

    this.showOurBoard();
}

MainMenu.prototype.requestShootAtTile = function () {
    this.showLoadingMessage("Fire in ze hole!"); //"bombs away!", "missle on route!"
    var self = this;
    //check selected tile, check ammo
    //Check if we're allowed to shoot at the tile? //show an error dialog
    this.communicator.requestShootTile(this.user, this.currentGame, this.crosshairIndex, function (index, boat, remainingAmmo, newBoatSunk, gameState) { self.recievedShootAtTile(index, boat, remainingAmmo, newBoatSunk, gameState); });
}

MainMenu.prototype.recievedShootAtTile = function (index, boat, remainingAmmo, newBoatSunk, gameState) {

    MaskHelper.setIndex(this.currentGame.theirShotMask, index);

    this.currentGame.currentAmmo = remainingAmmo;
    console.log("remaining Ammo: " + remainingAmmo);
    this.currentGame.gameState = gameState;
    console.log("GameState set to " + gameState);

    //check if turn is over
            // TODO Consider replacing with gameState === GameState.TheirTurn
    if (remainingAmmo === 0) {
        this.currentGame.gameState = GameState.TheirTurn;
        this.showTheirBoard();
    }

    if (boat) { //if we hit a boat
        MaskHelper.setIndex(this.currentGame.theirBoatMask, index);

        if (newBoatSunk !== undefined) { //append a boat object
            this.currentGame.theirBoats.push(newBoatSunk);
        }
    }
    if(gameState === GameState.WeWon) {
        this.showWeWon();
    } else if(gameState === GameState.TheyWon) {
        this.showTheyWon();
    }

    this.redraw();
    //TODO: remove one ammo or complete turn if we're out of ammo
}

MainMenu.prototype.requestPlaceBoats = function () {
    if(this.currentGame.gameState === GameState.PlaceBoats) {
        this.showLoadingMessage("Checking boat placements...");
        var self = this;
        // TODO add this to the communicator class
        this.communicator.requestPlaceBoats(this.user, this.currentGame, this.currentGame.ourBoats, function (game) { self.receivedPlaceBoats(game) });
    } else {
        console.log("WARNING: Tried to call place boats without PlaceBoats game state.")
    }
}

MainMenu.prototype.receivedPlaceBoats = function (game) {
    this.hideLoadingMessage();
    console.log("Boats were placed successfully!");
    this.gameList.addGames([game]);
    this.currentGame = game;
    this.showGame(this.currentGame);
    // TODO Show waiting for opponent
}

MainMenu.prototype.requestNewUser = function () {
    this.showLoadingMessage("Connecting to server...");
    var self = this;
    // TODO add this to the communicator class
    this.communicator.requestNewUser(function (user) { self.receivedNewUser(user) });
}

MainMenu.prototype.receivedNewUser = function (user) {
    this.hideLoadingMessage();
    console.log("A new user was returned successfully!");
    this.setLoggedInUser(user);
}

MainMenu.prototype.setLoggedInUser = function(user) {
    this.user = user;
    this.showGameList();
    this.beginRefreshGameList();
}

MainMenu.prototype.requestGameList = function () {
//    this.showLoadingMessage("Loading game list...");
    var self = this;
    // TODO add this to the communicator class
    if (this.user === null) {
        this.showLoginScreen();
        return;
    }

    this.communicator.requestGameList(this.user, this.gameList.games, function (statusCode, user) { self.receivedGameList(statusCode, user) });
}

MainMenu.prototype.receivedGameList = function (games) {
//    this.hideLoadingMessage();
    console.log("A game list was returned successfully!");
    this.gameList.addGames(games);
    this.redraw();
}

MainMenu.prototype.requestRandomGame = function () {
    this.showLoadingMessage("Requesting a random game...");
    var self = this;
    if (this.user === null) {
        this.showLoginScreen();
        return;
    }

    this.communicator.requestRandomGame(this.user, function (game) { self.receivedRandomGame(game); });
}

MainMenu.prototype.receivedRandomGame = function (game) {
    this.hideLoadingMessage();
    console.log("Received game");
    this.gameList.addGames([game]);
    this.showGame(game);
}

// *********** DRAWING STUFF *********** //

MainMenu.prototype.redraw = function () {

    this.clear();


    if(!this.draggedBoat) {
        this.buttonHandler.draw(this.ctx);
    } else {
        this.ctx.fillStyle = "rgb(50,100,200)";
        this.ctx.fillRect(100, 400, 200, 200);
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.font = "12pt Arial";
        this.ctx.fillText("Drag here to rotate", 120, 500);
    }

    if (this.menuState === MenuState.Ours) {
        // TODO Draw the board
        for (var i = 0; i < this.currentGame.nRows; i++) {
            for (var j = 0; j < this.currentGame.nCols; j++) {
                var index = this.currentGame.nRows * i + j;
                var hasHit = MaskHelper.getValueOfIndex(this.currentGame.ourShotMask, index);
                var hasBoat = MaskHelper.getValueOfIndex(this.currentGame.ourBoatMask, index);
                if (hasHit) {
                    if (hasBoat) {
                        this.ctx.fillStyle = "rgb(255,0,0)";
                    } else {
                        this.ctx.fillStyle = "rgb(150,150,255)";
                    }
                } else {
                    this.ctx.fillStyle = "rgb(0,0,255)";
                }
                this.ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
        for (var i = 0; i < this.currentGame.ourBoats.length; i++) {
            this.currentGame.ourBoats[i].draw(this.ctx);
        }
        this.ctx.fillStyle = "rgb(255,0,0)";
        this.ctx.font = "12pt Arial";
        this.ctx.fillText("Mine", 10, 20);
    } else if (this.menuState === MenuState.Theirs) {
        // TODO Draw the board
        for (var i = 0; i < this.currentGame.nRows; i++) {
            for (var j = 0; j < this.currentGame.nCols; j++) {
                var index = this.currentGame.nRows * i + j;
                var hasHit = MaskHelper.getValueOfIndex(this.currentGame.theirShotMask, index);
                var hasBoat = MaskHelper.getValueOfIndex(this.currentGame.theirBoatMask, index);
                if (hasHit) {
                    if (hasBoat) {
                        this.ctx.fillStyle = "rgb(255,0,0)";
                    } else {
                        this.ctx.fillStyle = "rgb(150,150,255)";
                    }
                } else {
                    this.ctx.fillStyle = "rgb(0,0,255)";
                }
                this.ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                if (index === this.crosshairIndex) {
                    this.ctx.fillStyle = "#FFFF00";
                    this.ctx.beginPath();
                    this.ctx.arc(j * tileSize +tileSize/2, i * tileSize+tileSize/2, 25, 0, Math.PI * 2, true);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }
        for (var i = 0; i < this.currentGame.theirBoats.length; i++) {
            this.currentGame.theirBoats[i].draw(this.ctx);
        }
        this.ctx.fillStyle = "rgb(255,0,0)";
        this.ctx.font = "12pt Arial";
        this.ctx.fillText("Theirs", 10, 20);
    }

    if(this.menuState === MenuState.Ours || this.menuState === MenuState.Theirs) {
        if(this.currentGame.gameState === GameState.WeWon) {
            this.ctx.fillStyle = "rgb(0,255,0)";
            this.ctx.font = "30pt Arial";
            this.ctx.fillText("We won! :D", 100, 200);
        } else if(this.currentGame.gameState === GameState.TheyWon) {
            this.ctx.fillStyle = "rgb(255,0,0)";
            this.ctx.font = "30pt Arial";
            this.ctx.fillText("They won... :(", 100, 200);
        }
    }

    this.ctx.font = "12pt Arial";
    this.ctx.fillText("GameState: " + this.currentGame.gameState, this.canvas.width - 100, 10);

    //this.ctx.fillStyle = "rgb(200,50,0)";
    //this.ctx.fillRect(100, this.canvas.height - 150, 200, 50);

    // Refresh the list of games
    //            this.gameList.refresh();
}


// *********** MOUSE HANDLING ********** //
MainMenu.prototype.canvasMouseMove = function (e) {
    var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas);
    this.lastPosX = mousePos.x;
    this.lastPosY = mousePos.y;

    if (this.menuState === MenuState.Theirs && this.currentGame.gameState === GameState.OurTurn && this.mouseDown) {
        this.setCrosshairIndex();
        this.redraw();
    }

    if (this.draggedBoat !== null) {
        var boat = this.draggedBoat;
        boat.x = mousePos.x - boat.width / 2;
        boat.y = mousePos.y - boat.height / 2;

        if(mousePos.x > 100 && mousePos.x < 300 && mousePos.y > 400 && mousePos.y < 600) {
            // boat has been dragged to rotation field
            if(!this.draggedBoatHasRotated) { // for the first time
                this.draggedBoatHasRotated = true;
                boat.horizontal = !boat.horizontal;
                boat.refreshRotation();
            }
        } else { // outside means it could be rotated again on drag back in
            this.draggedBoatHasRotated = false;
        }

        this.redraw();
    }
    return false;
}

MainMenu.prototype.canvasMouseUp = function (e) {
    this.mouseDown = false;

    //var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas); //This aint passed on touch phones
    var x = this.lastPosX;
    var y = this.lastPosY;

    if (this.menuState === MenuState.Ours || this.menuState === MenuState.Theirs) {
        if (this.draggedBoat !== null) {
            console.log("Finding best fit!");
            var boat = this.draggedBoat;
            var bestFit = 99999999;
            var bestFitIndex = 0;
            for (var i = 0; i < this.currentGame.nRows; i++) {
                for (var j = 0; j < this.currentGame.nCols; j++) {
                    var index = i * this.currentGame.nCols + j;
                    var diffX = j * tileSize - x + boat.width / 2;
                    var diffY = i * tileSize - y + boat.height / 2;
                    var ourFit = diffX * diffX + diffY * diffY;
                    if (ourFit < bestFit) {
                        bestFit = ourFit;
                        bestFitIndex = index;
                    }
                }
            }
            boat.setIndex(bestFitIndex);
        }
    }
    this.buttonHandler.mouseReleased(x, y);
    this.draggedBoat = null;
    this.redraw();
    return false;
}

MainMenu.prototype.canvasMouseDown = function (e) {
    this.mouseDown = true;
    var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas);
    this.lastPosX = mousePos.x;
    this.lastPosY = mousePos.y;

    this.buttonHandler.mousePressed(mousePos.x, mousePos.y);

    if (this.menuState === MenuState.Ours && this.currentGame.gameState === GameState.PlaceBoats) {
        console.log("spotted " + this.currentGame.ourBoats.length + "boats. With mouse coord: " + mousePos.x + "," + mousePos.y);
        for (var i = 0; i < this.currentGame.ourBoats.length; i++) {
            var boat = this.currentGame.ourBoats[i];
            if (boat.isClicked(mousePos.x, mousePos.y)) {
                console.log("boat clicked!!");
                this.draggedBoat = boat;
            }
        }
    } else if (this.menuState === MenuState.Theirs && this.currentGame.gameState === GameState.OurTurn) {
        this.setCrosshairIndex();
    }
    return false;
}
