;(function(exports) {

    function AI(player)
    {
        this.player = player;
        this.service = new BubbleShoot.Background('ai');
        this.state = 'bootstrap';

        var collisionProperties = {
            bubbleRadius : BubbleShoot.UI.bubble.radius,
            gameWidth : BubbleShoot.game.width,
        };
        var args = [this.player.getMetaData(), collisionProperties];
        this.service.execute('bootstrap', args, this.tick, this);
    }

    AI.prototype.stop = function()
    {
        this.state = 'stop';
        return clearTimeout(this.timer);
    }

    AI.prototype.tick = function()
    {
        clearTimeout(this.timer);
        if (this.state != 'stop') {
            this.timer = setTimeout(this.update.bind(this), 1500);
        }
    }

    AI.prototype.update = function()
    {
        if (this.state == 'updating' || !this.player.shooter.bubble) {
            return this.tick();
        }

        this.state = 'updating';

        this.fire(function() {
            this.updateGrid(function() {
                if (this.state != 'stop') {
                    this.state = 'updated';
                }
                this.tick();
            });
        });
    }

    AI.prototype.updateGrid = function(done)
    {
        this.service.execute('updateGrid', [this.player.board.getGridMetaData()], done, this);
    }

    AI.prototype.fire = function(done)
    {
        var find = function(data)
        {
            // BubbleShoot.game.tweens.removeFrom(this.player.shooter);

            var speed = 2000;
            var delta = 1000;
            var diff = this.player.shooter.rotation - data.rotation;

            if (this.player.shooter.rotation < data.rotation) {
                diff = data.rotation - this.player.shooter.rotation;
            }

            var time = Math.round(diff * 1000 / speed * delta); 
            if (time <= 0) {
                time = 50;
            }

            var tween = BubbleShoot.game.add.tween(this.player.shooter);
            tween.to({rotation : data.rotation}, time);
            tween.onComplete.add(function() {
                this.player.fire(done.bind(this), data.trajectory);
            }.bind(this))
            tween.start();
        }

        this.service.execute('findBestAgle', [this.player.shooter.bubble.tag], find, this);
    }

    AI.prototype.randomMove = function()
    {
        var increase = 33;
        var _angle = Math.abs(this.player.shooter.angle); 
        var _angle = Math.abs(180); 
        var min = Math.max(95, _angle - increase);
        var max = Math.min(265, _angle + increase);
        var data = { angle : Utils.getRandomInt(min, max)};
        data.rotation = Utils.degreesToRadians(data.angle);

        var tween = BubbleShoot.game.add.tween(this.player.shooter);
        tween.to({rotation : data.rotation}, 1000);
        tween.onComplete.add(function() {
            this.randomMove();
        }, this);
        tween.start();
    }

    exports.AI = AI;

})(BubbleShoot);
