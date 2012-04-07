var mainMenu;
function main() {
    console.log("Starting everything");
    mainMenu = new MainMenu();
    console.log("Initing application");
    mainMenu.initApplication();
    //    for(var i = 0; i < nRows * nCols; i++) {
    //        ourTiles[i] = new Tile(i);
    //        theirTiles[i] = new Tile(i);
    //        //servOurTiles[i] = new Tile(i);
    //        //servTheirTiles[i] = new Tile(i);
    //    }
    //TODO dette skjer for tidlig, må flyttes
    //        for(var i = 0; i < nBoats; i++) {
    //            switch(i) {
    //            case 0:
    //            case 1:
    //                size = 2;
    //                break;
    //            case 2:
    //            case 3:
    //                size = 3;
    //                break;
    //            case 4:
    //                size = 4;
    //                break;
    //            }

    //            ourBoats[i] = new Boat(size);
    //            ourBoats[i].setIndex(i);
    //        }

    //        showMenu();
}

// TODO Moved to communication class and logic to server
// TODO Rename and change logic! Find calls...
function getDataFromServer() {
    // server sends back the data
    var dataStringOur = JSON.stringify(servOurTiles);
    updateTiles(dataStringOur, ourTiles);

    var dataStringTheir = JSON.stringify(servTheirTiles);
    updateTiles(dataStringTheir, theirTiles);

    // draw everything again
    drawMap();
}

// TODO Rewrite to receive data from comm class
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

// TODO Move this to comm class and update server to actually store data
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

// TODO Move to comm class
function shootTile(index) {
    // send index to server
    // server updates the data
    servTheirTiles[index].isHit = true;
    // server sends back the data
    getDataFromServer();
}

// TODO Move to helper class (comm?)
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



