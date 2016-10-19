;(function(exports) { function Player(id, side) {

        this.id = id;
        this.side = side;
        this.shooter = new BubbleShoot.Shooter(this);
        this.board = new BubbleShoot.Board(this);
    }

    Player.prototype = {

        getMetaData : function()
        {
            return {
                id : this.id,
                side : this.side,
                shooter : this.shooter.getMetaData(),
                board : this.board.getMetaData(),
            }
        },

        fire : function(done, trajectory)
        {
            var fire = function(bubble)
            {
                var win = false, lose = false;

                // lose
                if ( (this.side == BubbleShoot.PLAYER_SIDE_BOTTOM &&
                      bubble.y + bubble.radius > this.shooter.y - this.shooter.height/2) ||
                     (this.side == BubbleShoot.PLAYER_SIDE_TOP &&
                      bubble.y - bubble.radius < this.shooter.y + this.shooter.height/2)
                   ) {
                   lose = true;
                }

                if (!lose) {
                    this.board.checkMatches(bubble);
                    this.board.checkOrphans();

                    var remaining = this.board.getRemaining();

                    // win
                    if (remaining.length == 0) {
                        win = true;
                    }
                }

                if (win) {
                    BubbleShoot.CurrenteState.finish(this);
                }
                if (lose) {
                    BubbleShoot.CurrenteState.finish(this.enemy);
                }

                // if (!win && !lose) {
                    // this.shooter._nextLoaded.push(this.board.getNextBubbleTag(remaining));
                // }

                if (done) {
                    done();
                }
            }
            this.shooter.fire(fire.bind(this), trajectory);
            this.shooter.reload();
        },
    }

    exports.Player = Player;

})(BubbleShoot);
