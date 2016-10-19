;(function(exports) {

    var Collision = {

        config : {
            gameWidth : 0,
            bubbleRadius : 0,
            trajectory : {
                distance : 0,
                duration : 600,
            } 
        },

        circleCollision : function(circleFirst, circleSecond, cutback) 
        {
            var distance = this.circleCollisionDistance(circleFirst.position, circleSecond.position);
            var radius = circleFirst.radius + circleSecond.radius;

            if (cutback) {
                radius -= (circleFirst.radius * cutback) + (circleSecond.radius * cutback);
            }
            return distance < radius;
        }, 

        circleCollisionDistance : function(circleFirst, circleSecond) 
        {
            var dx = circleFirst.x - circleSecond.x;
            var dy = circleFirst.y - circleSecond.y;
            return Math.sqrt(dx * dx + dy * dy);
        }, 

        bubbleIntersection : function(bubble, grid) {

            for (var row = 0; row < grid.length; row++) {

                var cols = grid[row];

                if (!cols) {
                    continue;
                }

                for (var col = 0; col < cols.length; col++) {

                    var curBubble = cols[col];

                    if (!curBubble) {
                        continue;
                    }

                    var curBubblePosition = curBubble.position;
                    if (curBubble.state == BubbleShoot.BUBBLE_STATE_FIRING) {
                        curBubblePosition = curBubble._endPosition;
                    }

                    var collision = Collision.circleCollision(
                        { position: bubble.position, radius: bubble.radius}, 
                        { position: curBubblePosition, radius: curBubble.radius}, 
                        0.1
                    );

                    if (collision) {
                        return curBubble;
                    }
                }
            }

            return false; 
        },

    }; 

    // module trajectory
    ;(function(exports) {

        // step distance/duration

        function step(position, dx, dy, board, stepIteration) {

            var safeLimit = 2000;
            var radius = Collision.config.bubbleRadius;

            var topSide = board.side == BubbleShoot.PLAYER_SIDE_TOP;

            var limitRight = Collision.config.gameWidth - radius;
            var limitLeft = radius;

            var limitTop = board.y + radius;

            if (topSide) {
                limitTop = board.y + board.height - radius;
            }

            var stepIteration = stepIteration ? ++stepIteration : 1;

            var collideWorldBounds = false;
            var bubbleCollision = false;

            position.x += dx;
            position.y -= dy;

            // top wall 
            if (!topSide && position.y <= limitTop) {
                position.y = limitTop;
                collideWorldBounds = 'top';
            }

            if (topSide && position.y >= limitTop) {
                position.y = limitTop;
                collideWorldBounds = 'top';
            }

            // left wall
            if (position.x <= limitLeft) {
                position.x = limitLeft;
                collideWorldBounds = 'left';
            }

            // right wall
            if (position.x >= limitRight) {
                position.x = limitRight;
                collideWorldBounds = 'right';
            }

            // bug?
            if (stepIteration > safeLimit) {
                console.error('Collision.Trajectory.step atingiu limit de iteracoes');
                return position;
            }

            bubbleCollision = Collision.bubbleIntersection(
                {position: position, radius : Collision.config.bubbleRadius}, board.grid
            );

            if (collideWorldBounds || bubbleCollision) {

                var distToCollision = stepIteration * Collision.config.trajectory.distance;
                // var duration = Math.round( Collision.config.trajectory.duration * distToCollision / 1000);

                var speed = 1500;
                var delta = 1000;
                var duration = Math.round(distToCollision / speed * delta);

                return { 
                    position : { x: position.x, y: position.y },
                    duration : duration,

                    collision : {
                        dist : distToCollision,
                        worldBounds : collideWorldBounds,
                        bubble : bubbleCollision,
                    }
                };
            }

            return step(position, dx, dy, board, stepIteration); 
        }

        function trajectory(bubble, angle, board)
        {
            var steps = [];

            var position = { x: bubble.x, y: bubble.y };
            var safeLimit = 2000;
            var dx = Math.sin(angle) * Collision.config.trajectory.distance;
            var dy = Math.cos(angle) * Collision.config.trajectory.distance;

            var steps = [];
            var iteration = 0;

            while(true) {

                iteration++;

                var currentStep = step(position, dx, dy, board);

                if (currentStep.collision.worldBounds) {
                    dx *= -1;
                }

                currentStep.angle = angle;
                steps.push(currentStep);

                if (iteration > safeLimit) {
                    console.error('while limit');
                    break;
                }

                if (!currentStep || currentStep.collision.bubble || currentStep.collision.worldBounds == 'top') {
                    break;
                }

            }

            return steps;
        }
            
        exports.trajectory = trajectory;
    
    })(Collision);
    
    exports.Collision = Collision;

})(BubbleShoot);
