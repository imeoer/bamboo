var path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    coffee = require('gulp-coffee'),
    less = require('gulp-less'),
    defineModule = require('gulp-define-module'),
    handlebars = require('handlebars'),
    modRewrite = require('connect-modrewrite');

var compileFunc = function(file, method, outpath) {
    if (method === 'template') {
        return gulp.src(file)
        // .pipe(handlebars())
        .pipe(defineModule('plain', {
            wrapper: 'define([], function() {return <%= handlebars %>});',
            context: function(context) {
                try {
                    var tplStr = '{';
                    var retAry = context.contents.split(/(<!-- \w+ -->)/ig);
                    for (var i = 1; i < retAry.length; i += 2) {
                        var name = retAry[i].match(/\w+/)[0];
                        var tpl = handlebars.precompile(retAry[i + 1]).toString();
                        tplStr += '"' + name + '":' + 'Handlebars.template(' + tpl + ')';
                        if ((i + 1) != retAry.length) {
                            tplStr += ',\n';
                        }
                    }
                    tplStr += '}';
                } catch(err) {
                    console.log(err);
                }
                return {handlebars: tplStr};
            }
        }))
        .pipe(gulp.dest(outpath));
    } else {
        return gulp.src(file)
        .pipe(method().on('error', function(err) {
            console.error(err.stack);
        }))
        .pipe(gulp.dest(outpath || 'src'));
    }
};

var compile = function(file, callback) {
    var cb = function() {
        if (callback) {
            callback();
        }
    };
    if (!file) {
        compileFunc('src/**/*.coffee', coffee).on('end', function() {
            compileFunc('src/**/*.less', less).on('end', function() {
                compileFunc('src/js/module/**/template.html', 'template', 'src/js/module').on('end', cb);
            });
        });
    } else {
        var extName = path.extname(file);
        var baseName = path.basename(file);
        if (extName === '.coffee' || extName === '.less') {
            compileFunc(file, (extName === '.coffee' ? coffee : less), path.dirname(file)).on('end', cb);
        } else if (baseName === 'template.html') {
            compileFunc(file, 'template', path.dirname(file)).on('end', cb);
        }
    }
};

gulp.task('publish', function() {
    compile(null, function() {
        gulp.src('src/**/*').pipe(gulp.dest('../public')).on('end', function() {
            gulp.src(['../public/**/*.coffee', '../public/**/*.less', '../public/js/**/template.html'], {
                read: false
            }).pipe(clean({force: true}));
        });
    });
});

gulp.task('cleanRelease', function() {
    return gulp.src('../public/', {
        read: false
    }).pipe(clean({force: true}));
});

gulp.task('clean', function() {
    return gulp.src(['src/**/*.js', '!src/js/vender/**/*.js', 'src/**/*.css', '!src/js/vender/**/*.css'], {
        read: false
    }).pipe(clean({force: true}));
});

gulp.task('compile', ['clean'], function() {
    compile();
});

gulp.task('connect', function() {
    connect.server({
        port: '8000',
        root: 'src',
        livereload: true,
        middleware: function() {
            return [modRewrite([
                '^(/article)?/css/(.*)$ /css/$2 [L]',
                '^(/article)?/js/(.*)$ /js/$2 [L]',
                '^(/article)?/img/(.*)$ /img/$2 [L]',
                '^(/edit)?/css/(.*)$ /css/$2 [L]',
                '^(/edit)?/js/(.*)$ /js/$2 [L]',
                '^(/edit)?/img/(.*)$ /img/$2 [L]',
                '.* /index.html'
            ])]}
        });
    });

gulp.task('watch', function() {
    gulp.watch(['src/**/*.html', 'src/**/*.coffee', 'src/**/*.less', 'src/**/*.js', 'src/**/*.css'], function(data) {
        console.info(data.type + ': ' + data.path);
        compile(data.path);
        gulp.src(data.path)
        .pipe(connect.reload());
    });
});

gulp.task('default', ['compile', 'connect', 'watch']);
gulp.task('release', ['cleanRelease', 'publish']);
