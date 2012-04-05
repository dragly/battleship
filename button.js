
function ButtonHandler() { //returns true if press was handled
    this.currentlyPressedButtonIndex = -1;
    this.buttons = new Array();

    this.addButton = function (width, height, x, y, text, event) {
        var btn = new button(width, height, x, y, text, event);
        this.buttons.push(btn);
        return btn;
    }

    this.mousePressed = function (x, y) {
        for (var i = 0; i < this.buttons.length(); i++) {
            if (buttons[i].isWithinBounds(x, y)) {
                this.currentlyPressedButtonIndex = i;
                buttons[i].pressKey();
                return true;
            }
        }
        return false;
    }

    this.mouseReleased = function (x, y) { //Has to be called every time the mouse is released, even if other handler catches the event
        if (currentlyPressedButtonIndex != -1) {
            var ret = buttons[currentlyPressedButtonIndex].keyRelease();
            currentlyPressedButtonIndex = -1;
            return ret;
        }
        return false;
    }
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

    this.isWithinBounds = function (x, y) {
        return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
    }

    this.pressKey = function () {
        this.isDown = true;
    }

    this.keyRelease = function () {
        this.isDown = false;

        if (this.isWithinBounds(x, y)) {
            this.clickEvent();
            return true;
        }
        return false;
    }

    this.draw = function () {
        ctx.fillStyle = "rgb(200,50,0)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillText(this.text, this.x + 5, this.y+5);
    }
}
    
