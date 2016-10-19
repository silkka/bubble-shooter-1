;(function(exports) {

    var Preloader = function(game) {
        this.game = game;
    }

    Preloader.prototype = {

        preload: function() {

            bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preload-background');
            bck.anchor.setTo(0.5,0.5);
            bck.scale.setTo(0.5,0.5);
            preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preload-bar');
            preloadBar.anchor.setTo(0,0.5);
            preloadBar.scale.setTo(0.5,1);
            preloadBar.x = this.world.centerX - preloadBar.width/2;

            this.load.setPreloadSprite(preloadBar);

            this.load.atlasJSONHash('sprites', 'src/img/sprites.png', 'src/json/sprites.json');
            this.load.atlasJSONHash('sprites2', 'src/img/sprites2.png', 'src/json/sprites2.json');
            //this.load.image("background", "src/img/background.jpg");

            this.load.bitmapFont('font', 'src/img/font.png', 'src/xml/font.xml');
        },

        create: function(){
            this.state.start('menu');
        }

    }

    exports.Preloader = Preloader;

})(this);
