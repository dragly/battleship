
function Boat(size) {
    this.index = -1;
    this.horizontal = 0;
    this.size = size;
    this.width = 0;
    this.height = 0;
    this.setHorizontal(false);
}

Boat.prototype.setHorizontal = function(horizontal) {
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
Boat.prototype.draw = function() {
    ctx.fillStyle = "rgb(100,100,100)";
    ctx.fillRect(this.x,this.y,this.width,this.height);

}

Boat.prototype.setIndex = function(index) {
    this.index = index;
    this.column = this.index % nCols;
    this.row = Math.floor(this.index / nCols);
    this.x = tileMargin + this.column * (tileSize + tileMargin) + tileSize / 4;
    this.y = tileMargin + this.row * (tileSize + tileMargin) + tileSize / 4;
}