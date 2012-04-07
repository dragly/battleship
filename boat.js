
var tileMargin = 0;
var tileSize = 25;

function Boat() {
    this.index = -1;
    this.horizontal = false;
    this.size = 0;
    this.width = 0;
    this.height = 0;
    this.setHorizontal(false);
    this.nCols = 0;
}

Boat.prototype.setHorizontal = function(horizontal) {
    this.horizontal = horizontal;
    this.updatePosition();
}
Boat.prototype.draw = function(ctx) {
    ctx.fillStyle = "rgb(100,100,100)";
    ctx.fillRect(this.x,this.y,this.width,this.height);
    console.log(this.x, this.width, this.y, this.height);
}

Boat.prototype.updatePosition = function(nCols) {
    this.nCols = nCols;
    this.column = this.index % nCols;
    this.row = Math.floor(this.index / nCols);
    this.x = tileMargin + this.column * (tileSize + tileMargin) + tileSize / 4;
    this.y = tileMargin + this.row * (tileSize + tileMargin) + tileSize / 4;
    this.length = tileSize * this.size - tileSize * 3 / 4 + tileMargin * this.size;
    if(this.horizontal) {
        this.width = this.length;
        this.height = tileSize / 2;
    } else {
        this.height = this.length;
        this.width = tileSize / 2;
    }
}
