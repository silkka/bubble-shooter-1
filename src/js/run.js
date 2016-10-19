;(function(exports) {

    var game = new Phaser.Game(BubbleShoot.UI.width, BubbleShoot.UI.height, Phaser.AUTO);
    game.state.add('boot', Boot);
    game.state.add('preloader', Preloader);
    game.state.add('menu', Menu);
    game.state.add('game', Game);
    game.state.start('boot');

    BubbleShoot.game = game;

})(this);
