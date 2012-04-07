function MouseHelper() {

    this.getCursorPosition = function (event, canvas) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var posX = 0;
        var posY = 0;
        var currentElement = canvas;

        if (event.touches !== undefined/* && evt.touches.length === 1*/) {// 1 finger only
            posX = event.touches[0].clientX;
            posY = event.touches[0].clientY;
        } else {
            posX = event.pageX;
            posY = event.pageY;
        }

        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        }
        while (currentElement = currentElement.offsetParent)

        var canvasX = posX - totalOffsetX;
        var canvasY = posY - totalOffsetY;
        //console.log(event.pageX + " " + currentElement.offsetLeft);
        return { x: canvasX, y: canvasY }
    }
}