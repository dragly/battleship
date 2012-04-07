var tileSize = 50;
var tileMargin = 0;

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
    this.communicator = new Communicator(this);
    this.gameList = new GameList(this);
    this.communicator.serverUrl = "192.168.1.105:8888";
    this.menuState = MenuState.Login; // 0 - game menu, 1 - our table, 2 - their table, 3 - login user
    this.gameState = GameState.PlaceBoats; // 0 - place boats, 1 - waiting for opponent, 2 - your turn, 3 - their turn
    this.canvas = 0;
    this.ctx = 0;
    this.user = null;
    this.isDragging = null;
    this.currentGame = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;

    //Buttons
    var self = this;
    this.buttonHandler = new ButtonHandler();

    //    this.newUserButton = new Button(this.buttonHandler, 100, 300, 200, 50, "Create new user", function () { self.requestNewUser() }); // <3 jallascript
    //    this.newRandomGameButton = new Button(this.buttonHandler, 100, 400, 200, 50, "New Random Game", function () { self.requestRandomGame() });
    this.placeBoatsButton = new Button(this.buttonHandler, 100, 400, 200, 50, "Place boats", function () { self.requestPlaceBoats() });
    this.goToGameListButton = new Button(this.buttonHandler, 100, 500, 200, 50, "Exit to Game List", function () { self.showGameList() });

    // Set up JQuery mobile
    $(document).bind("mobileinit", function () {
        $.extend($.mobile, {
            defaultPageTransition: 'none',
            defaultDialogTransition: 'none'
        });
    });
}

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
    this.ctx.canvas.height = window.innerHeight - 50;
}

MainMenu.prototype.showLoginScreen = function () {
    this.hideLoadingMessage();
    this.menuState = MenuState.Login;

    this.buttonHandler.hideAll();
    //    this.newUserButton.show();

    this.redraw();
    $.mobile.changePage("#loginPage");
}

MainMenu.prototype.showGameList = function () {
    this.menuState = MenuState.List;
    this.requestGameList();

    this.buttonHandler.hideAll();
    //    this.newRandomGameButton.show();

    this.redraw();
    $.mobile.changePage("#gameListPage");
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
    console.log("Showing game with ID " + game.gameID);
    this.currentGame = game;
    this.menuState = MenuState.Ours;

    this.buttonHandler.hideAll();
    this.goToGameListButton.show();
    this.placeBoatsButton.show();

    this.redraw();
    $.mobile.changePage("#gamePage");
}

MainMenu.prototype.requestShootAtTile = function (index) {
    this.showLoadingMessage("Fire in ze hole!"); //"bombs away!", "missle on route!"
    //check selected tile, check ammo
    //Check if we're allowed to shoot at the tile? //show an error dialog
    this.communicator.requestShootTile(this.currentGame, index);
}

MainMenu.prototype.recievedShootAtTile = function (success, index, boat, newBoatSunk) {
    this.hideLoadingMessage();

    if (!success) //TODO: display an error, or reload the game
        return;

    MaskHelper.setIndex(game.theirShotMask, index);

    if (boat)
        MaskHelper.setIndex(game.theirBoatMask, index);

    if (newBoatSunk != undefined) //append a boat object
        theirBoats.push(newBoatSunk);

    //TODO: remove one ammo or complete turn if we're out of ammo
}

MainMenu.prototype.requestPlaceBoats = function () {
    this.showLoadingMessage("Checking boat placements...");
    var self = this;
    // TODO add this to the communicator class
    this.communicator.requestPlaceBoats(this.user, this.currentGame, this.currentGame.ourBoats, function () { self.receivedPlaceBoats() });
}

MainMenu.prototype.receivedPlaceBoats = function () {
    this.hideLoadingMessage();
    console.log("Boats were placed successfully!");
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
    this.user = user;
    console.log(this.isDragging);
    this.showGameList();
}

MainMenu.prototype.requestGameList = function () {
    this.showLoadingMessage("Loading game list...");
    var self = this;
    // TODO add this to the communicator class
    if (this.user === null) {
        this.showLoginScreen();
        return;
    }

    this.communicator.requestGameList(this.user, this.gameList.games, function (statusCode, user) { self.receivedGameList(statusCode, user) });
}

MainMenu.prototype.receivedGameList = function (games) {
    this.hideLoadingMessage();
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

    if (this.menuState === MenuState.Ours) {
        this.ctx.fillText("Mine", 100, 100);
        // TODO Draw the board
        for (var i = 0; i < this.currentGame.nRows; i++) {
            for (var j = 0; j < this.currentGame.nCols; j++) {
                var index = this.currentGame.nRows * i + j;
                var hit = MaskHelper.getValueOfIndex(this.currentGame.ourShotMask, index);
                if (hit) {
                    this.ctx.fillStyle = "rgb(255,0,0)";
                } else {
                    this.ctx.fillStyle = "rgb(0,255,0)";
                }
                this.ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
        for (var i = 0; i < this.currentGame.ourBoats.length; i++) {
            this.currentGame.ourBoats[i].draw(this.ctx);
        }
    } else if (this.menuState === MenuState.Theirs) {
        this.ctx.fillText("Theirs", 100, 100);
        for (var i = 0; i < this.currentGame.theirTiles.length; i++) {
            this.currentGame.theirTiles[i].draw(this.ctx);
        }
        // TODO draw hit boats
        for (var i = 0; i < nBoats; i++) {
            //                        theirboats[i].draw();
        }
    } else {
        console.log("WARNING: Unknown menu state!");
    }

    this.buttonHandler.draw(this.ctx);

    this.ctx.fillText("GameState: " + this.gameState, this.canvas.width - 100, 10);

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

    if (this.isDragging !== null) {
        var boat = this.isDragging;
        boat.x = mousePos.x - boat.width / 2;
        boat.y = mousePos.y - boat.height / 2;
        this.redraw();
    }
    return false;
}

MainMenu.prototype.canvasMouseUp = function (e) {

    //var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas); //This aint passed on touch phones
    var x = this.lastPosX;
    var y = this.lastPosY;

    if (this.menuState === MenuState.Ours || this.menuState === MenuState.Theirs) {
        if (this.isDragging !== null) {
            console.log("Finding best fit!");
            var boat = this.isDragging;
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
    this.isDragging = null;
    this.redraw();
    return false;
}

MainMenu.prototype.canvasMouseDown = function (e) {
    var mousePos = this.mouseHelper.getCursorPosition(e, this.canvas);
    this.lastPosX = mousePos.x;
    this.lastPosY = mousePos.y;

    this.buttonHandler.mousePressed(mousePos.x, mousePos.y);

    if (this.menuState === MenuState.Ours && this.gameState === GameState.PlaceBoats) {
        console.log("spotted " + this.currentGame.ourBoats.length + "boats. With mouse coord: " + mousePos.x + "," + mousePos.y);
        for (var i = 0; i < this.currentGame.ourBoats.length; i++) {
            var boat = this.currentGame.ourBoats[i];
            if (boat.isClicked(mousePos.x, mousePos.y)) {
                console.log("boat clicked!!");
                this.isDragging = boat;
            }
        }
    }
    return false;
}
