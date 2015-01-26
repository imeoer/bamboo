var http = require('http');
var cp = require('child_process');

http.createServer(function (req, res) {
	req.on('data', function () {});
    req.on('end', function () {
        cp.exec('sudo git pull;gulp release', {cwd: '/data/apps/bamboo-web/'}, function(err, stdout, stderr) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(stdout + '\n\n' + stderr);
        });
    });
}).listen(8001, '0.0.0.0');