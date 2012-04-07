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
                for(var i = 0; i < this.games.length; i++) {
                    console.log("Comparing local game " + this.games[i].gameID + " with remote " + receivedGames[j].gameID);
                    if(this.games[i].gameID === receivedGames[j].gameID) {
                        console.log("We had this game already, updating");
                        this.games[i] = receivedGames[j];
                        hadGameAlready = true;
                    }
                }
                if(!hadGameAlready) {
                    console.log("Appending a game");
                    this.games.push(receivedGames[j]);
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


