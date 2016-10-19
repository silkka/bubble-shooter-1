;(function(exports) {

    /**
     * greatest common divisor 
     * For example, a 1024x768 monitor has a GCD of 256. 
     * When you divide both values by that you get 4x3 or 4:3.
     */
    function gcd (a, b) {
        return (b == 0) ? a : gcd (b, a%b);
    }

    var width = screen.width, height = screen.height;
    
    // detect aspect ratio from screen
    var divisor = gcd(width, height);
    exports.aspectRatio = [width/divisor, height/divisor];

})(BubbleShoot);
