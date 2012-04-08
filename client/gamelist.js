// Class that handles organizing and drawing the list of games
function GameList(mainMenu) {
    this.games = new Array();
    this.mainMenu = mainMenu;
}

GameList.prototype.addGames = function(receivedGames) {
            console.log("Trying to add " + receivedGames.length + " new games")
            console.log(receivedGames);
            for(var j = 0; j < receivedGames.length; j++) {
                var hadGameAlready = false;
                var receivedGame = receivedGames[j];
                for(var i = 0; i < this.games.length; i++) {
                    // IMPORTANT The games are not equal, so we must compare game ID.
                    // The game from the server is generated as a new local object.
                    console.log("Comparing local game " + this.games[i].gameID + " with remote " + receivedGame.gameID);
                    if(this.games[i].gameID === receivedGame.gameID) {
                        console.log("We had this game already, updating");
                        this.games[i] = receivedGame;
                        hadGameAlready = true;
                        if(this.mainMenu.currentGame.gameID === receivedGame.gameID
                                && this.mainMenu.currentGame.gameState !== GameState.PlaceBoats) { // avoid overwriting our game while we're placing boats
                            this.mainMenu.currentGame = receivedGame;
                            if(this.mainMenu.menuState === MenuState.Ours) {
                                this.mainMenu.showOurBoard();
                            } else if(this.mainMenu.menuState === MenuState.Theirs) {
                                this.mainMenu.showTheirBoard();
                            }
                        }
                    }
                }
                if(!hadGameAlready) {
                    console.log("Appending a game");
                    this.games.push(receivedGame);
                }
            }

            $("#gameList").empty();
            for(var i = 0; i < this.games.length; i++) {
                var game = this.games[i];
                $("<li><a onclick='mainMenu.showGameByID(" + game.gameID + ")' >Game " + game.gameID + "</a></li>").appendTo($("#gameList"));
            }
            this.refresh();
            console.log("We now have " + this.games.length + " games available to play.")
        }

GameList.prototype.refresh = function() {
            $("#gameList").listview("refresh"); // This line now updates the listview
        }


