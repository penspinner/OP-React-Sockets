var gulp = require('gulp'),
    gulp_babel = require('gulp-babel'),
    gulp_browserify = require('gulp-browserify');

var outputDir = 'app/';

var jsDir = 'process/js/';

gulp.task('js', function()
{
    gulp.src(jsDir + 'app.js')
        .pipe(gulp_babel({presets: ["es2015", "react"]}))
        .pipe(gulp_browserify())
        .pipe(gulp.dest(outputDir + 'js'));
});

gulp.task('watch', function()
{
    gulp.watch(jsDir + '*', ['js']);
});

gulp.task('connect', function()
{
});

gulp.task('default', ['js','connect', 'watch']);