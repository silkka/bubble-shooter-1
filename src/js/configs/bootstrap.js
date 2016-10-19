;(function(exports) {

    var BubbleShoot = exports.BubbleShoot = {

        MODES : {
            SINGLEPLAYER : 'singleplayer',
        },

        PLAYER_SIDE_TOP : 'top',
        PLAYER_SIDE_BOTTOM: 'bottom',

        BUBBLE_STATE_ON_BOARD : 1,
        BUBBLE_STATE_FIRING : 3,
        BUBBLE_STATE_POPPING : 4,

        debug : false,
        Service : {},
    };

})(this.window || this);
