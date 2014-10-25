var gulp = require('gulp');
var path = require('path');
var cp = require('child_process');
var connect = require('gulp-connect');

gulp.task('watch', function() {
    gulp.watch(['src/*.go'], function(data) {
        cp.exec('go build src/ink.go', function(err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            } else {
                cp.exec('pkill -9 ink', function(err, stdout, stderr) {
                    // console.log('-----result-----');
                    var proc = cp.exec('./ink');
                    proc.stdout.on('data', function (data) {
                        console.log('out:\n' + data);
                    });
                    proc.stderr.on('data', function (data) {
                        console.log('err:\n' + data);
                    });
                });
            }
        });
    });
});

gulp.task('connect', function() {
    connect.server({
        port: '9091',
        root: 'src',
        livereload: true
    });
});

gulp.task('default', ['watch', 'connect']);
