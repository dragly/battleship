function MouseHelper() {

    this.getCursorPosition = function(event, canvas) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var currentElement = canvas;

        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        }
        while (currentElement = currentElement.offsetParent)

        var canvasX = event.pageX - totalOffsetX;
        var canvasY = event.pageY - totalOffsetY;
        //console.log(event.pageX + " " + currentElement.offsetLeft);
        return { x: canvasX, y: canvasY }
    }
}
