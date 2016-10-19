;(function(exports) {

    var spriteNames = ['green', 'blue', 'yellow', 'red', 'magenta', 'orange'];

    function Bubble(player, row, col, spriteName)
    {
        Phaser.Sprite.call(this, BubbleShoot.game, 0, 0, 'sprites', spriteName || Bubble.getRandomSprite());
        BubbleShoot.entities.bubbles.add(this);

        this.player = player;

        // this.body.collideWorldBounds = true;
        // this.body.bounce.setTo(1);

        this.tag = this.frameName;

        this.scale.setTo(BubbleShoot.UI.bubble.scale);
        this.anchor.setTo(0.5);
        this.row = row;
        this.col = col;
        this.radius = BubbleShoot.UI.bubble.radius;
    }

    Bubble.prototype = Object.create(Phaser.Sprite.prototype);
    Bubble.prototype.constructor = Bubble;

    Bubble.prototype.getGridByPosition = function(position)
    {
        var topSide = this.player.side == BubbleShoot.PLAYER_SIDE_TOP;
        var board = this.player.board;
        var position = position || this.position;
        var separatorHeight = BubbleShoot.UI.board.separatorHeight + 1;

        var row = Math.floor( (position.y - board.y) / BubbleShoot.UI.board.rowHeight);

        if (topSide) {
            var row = Math.floor( (board.height - position.y) / BubbleShoot.UI.board.rowHeight);
        }

        var marginLeft = row % 2 == 0 ? BubbleShoot.UI.bubble.radius : BubbleShoot.UI.bubble.radius * 2;
        var col = (position.x - board.x + marginLeft) / BubbleShoot.UI.bubble.size;

        col = Math.round(col);

        if (col > BubbleShoot.UI.maxCols) {
            col = BubbleShoot.UI.maxCols;
        }

        if(row % 2 == 1) {
            col -= 2;
        }
        if(row % 2 == 0) {
            col -= 1;
        }

        return { row : row, col : col };
    }

    Bubble.prototype.fixGridByPosition = function(position)
    {
        var grid = this.getGridByPosition(position);
        this.row = grid.row;
        this.col = grid.col;
    }

    Bubble.prototype.getPositionByGrid = function(grid)
    {
        var grid = grid || {row : this.row, col : this.col};

        if (grid.row === undefined || grid.col === undefined) {
            console.error('getPositionByGrid', grid.row, grid.col);
            return false;
        }

        var topSide = this.player.side == BubbleShoot.PLAYER_SIDE_TOP;
        var separatorHeight = BubbleShoot.UI.board.separatorHeight + 1;
        var x = this.player.board.x;
        var y = this.player.board.height + BubbleShoot.UI.bubble.radius;

        if (grid.row % 2 == 0) {
            x += BubbleShoot.UI.bubble.radius;
        } else {
            x += BubbleShoot.UI.bubble.radius * 2;
        }

        if (topSide) {
            y -= ((grid.row +1) * BubbleShoot.UI.board.rowHeight) + separatorHeight;
        } else {
            y += (grid.row * BubbleShoot.UI.board.rowHeight) + (separatorHeight*1.5);
        }

        return { x : x + (grid.col * BubbleShoot.UI.bubble.size), y : y};
    }

    Bubble.prototype.fixPositionByGrid = function(grid)
    {
        var position = this.getPositionByGrid(grid);
        this.position.setTo(position.x, position.y);

        this.createDebugText();
    }

    Bubble.prototype.move = function(steps, done, attach)
    {
        if (false === Array.isArray(steps)) {
            return console.error('invalid parameters, expected Array of steps');
        }

        this.state = BubbleShoot.BUBBLE_STATE_FIRING;
        var attach = attach == undefined ? true : attach;
        var throwAnim = BubbleShoot.game.add.tween(this);

        steps.forEach(function(step) {
            throwAnim.to({x : step.position.x, y: step.position.y}, step.duration);
        });

        if (attach) {
            var position = steps.pop().position;
            this.fixGridByPosition(position);
            this.player.board.addBubble(this);
            this._endPosition = this.getPositionByGrid();
        }

        throwAnim.onComplete.add(function() {

            if (attach) {
                this.state = BubbleShoot.BUBBLE_STATE_ON_BOARD;
                this.fixPositionByGrid();
                delete this._endPosition;
            }
            if (done) {
                done(this);
            }
        }.bind(this));

        throwAnim.start();
    }

    Bubble.prototype.getMetaData = function()
    {
        return {
            tag: this.tag,
            radius: this.radius,
            row: this.row,
            col: this.col,
            x: this.x,
            y: this.y,
            position : {
                x : this.x,
                y : this.y,
            },
            _endPosition : this._endPosition,
            state : this.state,
        }
    }

    Bubble.prototype.createDebugText = function()
    {
        if (!BubbleShoot.debug) {
            return false;
        }

        if (!this.debugText) {
            var style = { font: "50px Arial", fill: "#ffffff" };
            var text = BubbleShoot.game.add.text(0, 0, '', style);
            text.anchor.setTo(0.5);
            this.addChild(text);
            this.debugText = text;
        }

        if (this.row == undefined || this.col == undefined) {
            return this.debugText.setText('');
        }

        this.debugText.setText(String(this.row) + ' - ' + String(this.col));
    }

    Bubble.RADIUS = 177/2 //189/2;
    Bubble.SIZE = Bubble.RADIUS * 2;

    Bubble.create = function(player, row, col, spriteName)
    {
        var bubble = BubbleShoot.entities.bubbles.getFirstDead();
        var spriteName = spriteName || Bubble.getRandomSprite();

        if (bubble) {
            bubble.revive();
            bubble.row = row;
            bubble.col = col;
            bubble.frameName = spriteName;
            bubble.tag = spriteName;
            bubble.player = player;
        }

        if (!bubble) {
            bubble = new Bubble(player, row, col, spriteName);
        }

        bubble.createDebugText();

        return bubble;
    }

    Bubble.getRandomSprite = function()
    {
        return spriteNames[Utils.getRandomInt(0, spriteNames.length - 1)];
    }

    exports.Bubble = Bubble;

})(BubbleShoot);
