function Tile(index) {
    this.isBoat = false;
    this.isHit = false;
    this.index = index;
    this.column = index % nCols;
    this.row = Math.floor(index / nCols);
    this.x = tileMargin + this.column * (tileSize + tileMargin);
    this.y = tileMargin + this.row * (tileSize + tileMargin);
}

Tile.prototype.draw = function() {
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

Tile.prototype.isClicked = function (x, y) {
    var clickedMe = x > this.x && x < this.x + tileSize && y > this.y && y < this.y + tileSize;
    if (clickedMe) {
        console.log("You clicked " + this.index);
        switch (gameState) {
            case 0:
                if (menuState == 1) {
                    placeBoat(index);
                }

                break;
            case 1:
                break;
            case 2:
                if (menuState == 2) {
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