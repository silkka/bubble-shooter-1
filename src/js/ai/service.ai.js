var player;

importScripts('../configs/bootstrap.js');
importScripts('../configs/utils.js');
importScripts('../components/collision.js');
importScripts('../components/board.js');

function response(data, args)
{
    var args = args || [];
    if (!Array.isArray(args)) {
        args = [args];
    }
    postMessage({ id: data.id, args: args});
}

self.addEventListener('message', function(event) {

    var data = event.data;

    switch (data.command) {

        case 'bootstrap' :
            bootstrap.apply(null, data.args);
            response(data);
        break;

        case 'findBestAgle' :
            response(data, findBestAgle.apply(null, data.args));
        break;

        case 'updateGrid' :
            response(data, updateGrid.apply(null, data.args));
        break;
    }

});

function bootstrap(_player, collisionProperties)
{
    var board = new BubbleShoot.Board(_player);

    for (var prop in _player.board) {
        board[prop] = _player.board[prop];
    }

    player = _player;
    player.board = board;

    initializeCollisionProperties(collisionProperties);
}

function updateGrid(grid)
{
    player.board.grid = grid;
}

function findBestAgle(tag)
{
    var min = 95;
    var max = 265;
    var ordered = [];
    var angle = min;
    var speed = 0.5;

    while (angle <= max) {

        var rotation = Utils.degreesToRadians(angle);
        var trajectory = getBubbleTrajectory(player.shooter.position, rotation, player.board);
        var matches = getMatches(tag, trajectory);

        var distance = 0;
        trajectory.forEach(function(step) {
            distance += step.collision.dist;
        });

        var current = {
            rotation : rotation,
            angle : angle,
            trajectory : trajectory,
            matches : matches,
            trajectories : trajectory.length,
            distance : distance,
        }

        ordered.push(current);
        angle += speed;
    }

    Utils.keySort(ordered, {
        matches: 'desc',
        trajectories : 'asc',
        distance : 'desc',
    });

    return ordered.shift();
}

function initializeCollisionProperties(data)
{
    var config = BubbleShoot.Collision.config;
    config.bubbleRadius = data.bubbleRadius;
    config.trajectory.distance = data.bubbleRadius/5;
    config.trajectory.duration = 600;
    config.gameWidth = data.gameWidth;
}

function getBubbleTrajectory(position, angle, board)
{
    var trajectory = BubbleShoot.Collision.trajectory(position, angle, board);
    return trajectory;
}

function getMatches(tag, trajectory)
{
    var matches = 0;
    var bubble = trajectory[trajectory.length-1].collision.bubble;

    if (bubble && bubble.tag == tag) {

        matches++;
        var group = player.board.getGroup(bubble);
        matches += group.list.length;

        if (matches >= 3) {
            matches += player.board.findOrphans().length;
        }
    }

    return matches;
}
