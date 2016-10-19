;(function(exports) {

    var Shooter = function(player) {

        Phaser.Sprite.call(this, BubbleShoot.game, BubbleShoot.game.world.centerX, 0, 'sprites2', 'shooter');
        BubbleShoot.entities.add(this);

        player.shooter = this;
        this.player = player;

        this._loaded = false;
        this._loading = false;
        this._nextLoaded = []; 

        this.scale.setTo(0.3);
        this.anchor.setTo(0.5, 0.75);

        if (player.side == BubbleShoot.PLAYER_SIDE_TOP) {
            this.angle = 179;
            this.y = this.height/4;
        }

        if (player.side == BubbleShoot.PLAYER_SIDE_BOTTOM) {
            this.angle = 0;
            this.y = BubbleShoot.game.height - this.height/4;
        }
    }

    Shooter.prototype = Object.create(Phaser.Sprite.prototype);
    Shooter.prototype.constructor = Shooter;

    Shooter.prototype.fire = function(done, trajectory) {

        var bubble = this.bubble;

        if (!bubble || !this._loaded) {
            return false;
        }

        var trajectory = trajectory || BubbleShoot.Collision.trajectory(this.position, this.rotation, this.player.board);
        bubble.move(trajectory, done);
        this.bubble = null; 
    };

    Shooter.prototype.getBitmapData = function() {

        if (!this.bmd) {
            this.bmd = BubbleShoot.game.add.bitmapData(this.player.board.width, this.player.board.height);
            var sprite = BubbleShoot.game.add.sprite(this.player.board.x, this.player.board.y, this.bmd);
            BubbleShoot.entities.add(sprite);
        }
        return this.bmd;
    }

    Shooter.prototype.showTrajectory = function() {

        var trajectory = BubbleShoot.Collision.trajectory(this.position, this.rotation, this.player.board);
        
        var bmd = this.getBitmapData();
        var context = bmd.context;
        var board = this.player.board;

        bmd.clear();
        context.strokeStyle = "#666";
        context.beginPath();
        context.lineWidth = 3;
        context.setLineDash([7]);

        context.moveTo(this.position.x - board.x, this.position.y - board.y);
        trajectory.forEach(function(step, index) {
            context.lineTo(step.position.x - board.x, step.position.y - board.y);
        }.bind(this));
        context.stroke();
    };

    Shooter.prototype.reload = function(force, nextTag) {

        if (this.bubble || this._loading) {
            return false;
        }

        this._loading = true;
        this._loaded = false;

        var bubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, this._nextLoaded.shift());

        bubble.anchor.setTo(0.5)
        bubble.position.set(this.x, this.y);
        
        var done = function() {
            this.bubble = bubble;
            this._loading = false;
            this._loaded = true;
        };

        if (force) {
            return done.call(this);
        }

        var scale = BubbleShoot.UI.bubble.scale;
        bubble.scale.setTo(0.001);
        var anim = BubbleShoot.game.add.tween(bubble.scale);
        anim.to({x: scale, y: scale}, 333);
        anim.onComplete.add(done.bind(this));
        anim.start();

        return true;
    };

    Shooter.prototype.setRotation = function(rotation) 
    {
        this.rotation = rotation;

        if (this.player.side == BubbleShoot.PLAYER_SIDE_BOTTOM && Math.abs(this.angle) > 85) {
            this.angle = this.angle > 0 ? 85 : -85;
        }

        if (this.player.side == BubbleShoot.PLAYER_SIDE_TOP && Math.abs(this.angle) < 95) {
            this.angle = this.angle > 0 ? 95 : -95;
        }
    }

    Shooter.prototype.getMetaData = function()
    {
        return {
            x : this.x,
            y: this.y,
            position : {
                x : this.x,
                y : this.y,
            },
            rotation : this.rotation,
        }
    }

    exports.Shooter = Shooter;

})(BubbleShoot);
