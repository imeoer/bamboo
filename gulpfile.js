var gulp = require('gulp');
var path = require('path');
var cp = require('child_process');
var connect = require('gulp-connect');

gulp.task('watch', function() {
    gulp.watch(['src/ink/**/*.go'], function(data) {
        cp.exec('go install ink', function(err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            } else {
                console.log("compiled");
            }
        });
    });
    gulp.watch(['src/test/test.go'], function(data) {
        cp.exec('go build src/test/test.go', function(err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            } else {
                cp.exec('pkill -9 test', function(err, stdout, stderr) {
                    // console.log('-----result-----');
                    var proc = cp.exec('./test');
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
    gulp.watch(['src/bamboo/**/*.go'], function(data) {
        cp.exec('go install bamboo', function(err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            } else {
                console.log("compiled");
            }
        });
    });
    gulp.watch(['src/*.go'], function(data) {
        cp.exec('go build src/*.go', function(err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            } else {
                console.log("compiled");
                cp.exec('pkill -9 main', function(err, stdout, stderr) {
                    // console.log('-----result-----');
                    var proc = cp.exec('./main');
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
