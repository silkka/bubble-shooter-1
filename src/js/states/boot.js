;(function(exports) {

    var Boot = function(game) {
        this.game = game;
    }

    Boot.prototype = {

        preload : function() {

            this.stage.backgroundColor = BubbleShoot.UI.background;

            this.load.image('preload-bar', 'src/img/preload-bar.png');
            this.load.image('preload-background', 'src/img/preload-background.png');
        },

        create : function() {

            // set scale options
            this.input.maxPointers = 1;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            // this.scale.setScreenSize(true);

            // this.scale.maxWidth = Math.round(BubbleShoot.UI.width * 0.7);
            // this.scale.maxHeight = Math.round(BubbleShoot.UI.height * 0.7);

            // this.scale.forceOrientation(true, false);

            // start the Preloader state
            this.state.start('preloader');
        }

    }

    exports.Boot = Boot;

})(this);
