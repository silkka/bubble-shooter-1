;(function(exports) {

    function Background(servieName)
    {
        this.queue = {};

        if (Worker) {
            this.worker = new Worker('src/js/ai/service.'+ servieName + '.js');
        } else {
            alert('Error: Worker not suported!');
            // this.worker = new BubbleShoot.Service.FakeWorker();
        }

        var _this = this;
        this.worker.addEventListener('message', function(event) {
            var data = event.data, queue = _this.queue[data.id];
            if (_this.queue[data.id]) {
                _this.queue[data.id].done.apply(queue.context, data.args);
                delete _this.queue[data.id];
            }
        });
    }

    Background.prototype.execute = function(command, args, done, context)
    {
        var id = Utils.generateUUID();
        if (done) {
            this.queue[id] = {done: done, context: context || null};
        }
        this.worker.postMessage({id : id, command: command, args : args});
    }

    exports.Background = Background;

})(BubbleShoot);
