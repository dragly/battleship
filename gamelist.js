// Class that handles organizing and drawing the list of games
function GameList() {
    this.games = new Array();
}

GameList.prototype.setGames = function(games) {
            console.log("We now have " + this.games.length + " games available to play.")

            this.games = games;
            $("#gameList").empty();
            for(var i = 0; i < games.length; i++) {
                var game = games[i];
                $("<li><a onclick='mainMenu.showGameByID(" + game.gameID + ")' >Game " + game.gameID + "</a></li>").appendTo($("#gameList"));
            }
            this.refresh();
        }

GameList.prototype.refresh = function() {
            $("#gameList").listview("refresh"); // This line now updates the listview
        }
