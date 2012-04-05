function ButtonHandler() { //returns true if press was handled
    this.currentlyPressedButtonIndex = -1;
    this.buttons = new Array();
}
ButtonHandler.prototype.addButton = function (width, height, x, y, text, event) {
    var btn = new Button(width, height, x, y, text, event);
    this.buttons.push(btn);
    return btn;
}
ButtonHandler.prototype.mouseReleased = function (x, y) {
            //Has to be called every time the mouse is released, even if other handler catches the event
    if (currentlyPressedButtonIndex != -1) {
        var ret = buttons[currentlyPressedButtonIndex].mouseReleased(x,y);
        currentlyPressedButtonIndex = -1;
        return ret;
    }
    return false;
}
ButtonHandler.prototype.mousePressed = function (x, y) {
    for (var i = 0; i < this.buttons.length(); i++) {
        if (buttons[i].isWithinBounds(x, y)) {
            this.currentlyPressedButtonIndex = i;
            buttons[i].mousePressed();
            return true;
        }
    }
    return false;
}

function Button(width, height, x, y, text,event) {
    //TODO: Pos and size should be relative, text should be removed and replaced with images for states "Down,Up,Inactive"
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.text = text;
    this.isActive = true;
    this.isVisible = true;
    this.isDown = false;
    this.clickEvent = event; //event triggered on key-release
}

Button.prototype.isWithinBounds = function (x, y) {
    return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
}
Button.prototype.mousePressed = function () {
    this.isDown = true;
}
Button.prototype.mouseReleased = function () {
    this.isDown = false;

    if (this.isWithinBounds(x, y)) {
        this.clickEvent();
        return true;
    }
    return false;
}
Button.prototype.draw = function () {
    ctx.fillStyle = "rgb(200,50,0)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillText(this.text, this.x + 5, this.y + 5);
}
    
