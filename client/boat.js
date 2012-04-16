var tileSize = 50;
var tileMargin = 0;

function Boat(image) {
    this.index = -1;
    this.horizontal = false;
    this.size = 0;
    this.width = 0;
    this.height = 0;
    this.setHorizontal(false);
    this.nCols = 0;
}

Boat.prototype.setIndex = function(index) {
    this.index = index;
    this.refreshPosition(this.nCols);
}

Boat.prototype.setHorizontal = function(horizontal) {
    this.horizontal = horizontal;
    this.refreshPosition(this.nCols);
}
Boat.prototype.draw = function(ctx, boatImagesH, boatImagesV) {
//    ctx.fillStyle = "rgb(100,100,100)";
//    ctx.fillRect(this.x,this.y,this.width,this.height);
    var x = this.x;
    var y = this.y;
    var img;
    var scale;
    if(this.horizontal) {
        img = boatImagesH[this.size];
        scale = this.width / img.width;
        if(this.size === 4) {
            y -= 10; // adjust for big carrier
        }
        if(this.size === 2) {
            x += 15;
            y += 10;
        }
    } else {
        img = boatImagesV[this.size];
        scale = this.height / img.height;
        if(this.size === 4) {
            x -= 10; // adjust for big carrier
        }
        if(this.size === 2) {
            x += 10;
            y += 15;
        }
    }
    if(this.size === 2) {
        scale *= 0.6;
    }

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

Boat.prototype.refreshRotation = function() {
    this.length = tileSize * this.size;
    if(this.horizontal) {
        this.width = this.length;
        this.height = tileSize;
    } else {
        this.height = this.length;
        this.width = tileSize;
    }
}

Boat.prototype.refreshPosition = function(nCols) {
    this.nCols = nCols;
    this.column = this.index % nCols;
    this.row = Math.floor(this.index / nCols);
    this.x = tileMargin + this.column * (tileSize + tileMargin);
    this.y = tileMargin + this.row * (tileSize + tileMargin);
    this.refreshRotation();
}

Boat.prototype.isClicked = function(x,y) {
    return (x > this.x && y > this.y && x < this.x + this.width && y < this.y + this.height);
}
