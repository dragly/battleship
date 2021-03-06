
function ButtonHandler() { //returns true if press was handled
    this.currentlyPressedButtonIndex = -1;
    this.buttons = new Array();
}
ButtonHandler.prototype.addButton = function (btn) {
    this.buttons.push(btn);
    return btn;
}
ButtonHandler.prototype.mouseReleased = function (x, y) {
            //Has to be called every time the mouse is released, even if other handler catches the event
    if (this.currentlyPressedButtonIndex != -1) {
        var ret = this.buttons[this.currentlyPressedButtonIndex].mouseReleased(x,y);
        this.currentlyPressedButtonIndex = -1;
        return ret;
    }
    return false;
}
ButtonHandler.prototype.mousePressed = function (x, y) {
    for (var i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].isVisible && this.buttons[i].isActive && this.buttons[i].isWithinBounds(x, y)) {
            this.currentlyPressedButtonIndex = i;
            this.buttons[i].mousePressed();
            return true;
        }
    }
    return false;
}

ButtonHandler.prototype.hideAll = function () {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].isVisible = false;
    }
}

ButtonHandler.prototype.draw = function (ctx) {

    for (var i = 0; i < this.buttons.length; i++) {

        if (this.buttons[i].isVisible) {
            this.buttons[i].draw(ctx);
        }
    }
}

function Button(buttonHandler, x, y, width, height, text, event) {
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
    buttonHandler.addButton(this);
}

Button.prototype.isWithinBounds = function (x, y) {
    return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
}
Button.prototype.mousePressed = function () {
    this.isDown = true;
}
Button.prototype.mouseReleased = function (x,y) {
    this.isDown = false;

    if (this.isWithinBounds(x, y)) {
        this.clickEvent();
        return true;
    }
    return false;
}
Button.prototype.show = function () {
    this.isVisible = true;
}

Button.prototype.draw = function (ctx) {

    ctx.fillStyle = "rgb(200,50,0)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.font = "12pt Arial";
    ctx.fillText(this.text, this.x + 10, this.y + 30);
}
    
