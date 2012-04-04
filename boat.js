function Boat(size) {
    this.index = -1;
    this.horizontal = 0;
    this.size = size;
    this.width = 0;
    this.height = 0;
    this.setHorizontal = function(horizontal) {
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

    this.draw = function() {
             ctx.fillStyle = "rgb(100,100,100)";
             ctx.fillRect(this.x,this.y,this.width,this.height);

         }
    this.setIndex = function(index) {
             this.index = index;
             this.column = this.index % nCols;
             this.row = Math.floor(this.index / nCols);
             this.x = tileMargin + this.column * (tileSize + tileMargin) + tileSize / 4;
             this.y = tileMargin + this.row * (tileSize + tileMargin) + tileSize / 4;
         }
         this.isClicked = function (x, y) {
             console.log("boat index: " + this.index + " pos:" + this.x + "," + this.y);
             var clickedMe = x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
             return clickedMe;
         }
    this.setHorizontal(false);
}
