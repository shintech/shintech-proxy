var cluster = require('cluster');
var app = require('./server')


var cluster = require('cluster'),
    numCPUs = process.env.NODE_THREADS || require('os').cpus().length;

if (cluster.isMaster && numCPUs > 1) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    app.listen(process.env.PORT || 8000);
}