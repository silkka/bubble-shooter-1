;(function(exports) {

    var maxRows = 6;
    var maxCols = 8;

    var colWidth = BubbleShoot.Bubble.SIZE;
    var rowHeight = BubbleShoot.Bubble.SIZE;

    var screenWidth = Math.min(window.innerWidth, window.innerHeight);
    var screenHeight = Math.min(window.innerWidth, screenWidth * 2);

    var screenWidth = 586;
    var screenHeight = 1024;

    // 16:9 640x360
    // screenWidth = 360; screenHeight = 640;

    var width = screenWidth;
    var height = screenHeight;

    var boardWidht = screenWidth;
    var boardHeight = screenHeight/2;

    // var scale = Math.min((boardWidht/colWidth/maxCols), (boardHeight/rowHeight/maxRows));
    // var bubbleScale = Utils.mean([boardWidht/colWidth/maxCols, boardHeight/rowHeight/maxRows]);
    var bubbleScale = boardWidht/colWidth/maxCols;
    var bubbleSize = BubbleShoot.Bubble.SIZE * bubbleScale;

    var UI = {

        background: '#222222',

        width : width,
        height: height,

        maxRows : maxRows,
        maxCols : maxCols,

        bubble : {
            scale: bubbleScale,
            size : bubbleSize,
            radius : bubbleSize/2,
        },

        board : {
            width : boardWidht,
            height : boardHeight,
            rowHeight : bubbleSize - 9,
            separatorHeight : 5,
        }

    }

    exports.UI = UI;

})(BubbleShoot);
