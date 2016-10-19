;(function(exports) {

    var Menu = function(_game)
    {
        this.game = _game;
    }

    Menu.prototype = {

        create: function()
        {
            var textName = this.game.add.bitmapText(
                this.game.world.centerX, this.game.world.centerY, 'font', 'BUBBLE SHOOTER', 50
            );
            textName.anchor.setTo(0.5);
            textName.y -= textName.height * 2;

            var singlePlayerButton = Utils.createButton({
                label: 'PLAY',
                position: {
                    x : this.game.world.centerX,
                    y: textName.y + textName.height + 100
                },
                callback : function() {
                    if (!Phaser.Device.desktop) {
                        this.startFullScreen();
                    }
                    BubbleShoot.mode = BubbleShoot.MODES.SINGLEPLAYER;
                    this.state.start('game');
                },
                context: this
            });
        },

        startFullScreen : function()
        {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.startFullScreen(false);
        },

    }

    exports.Menu = Menu;

})(this);
