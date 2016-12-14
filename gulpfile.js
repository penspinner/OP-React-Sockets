var gulp = require('gulp'),
    gulp_babel = require('gulp-babel'),
    gulp_browserify = require('gulp-browserify'),
    gulp_sass = require('gulp-sass');

var outputDir = 'app/',
    process = 'process/',
    app = process + 'app.js',
    jsDir = process + 'js/',
    sassDir = process + 'sass/';

/* Compiles the app.js (node starting point) in ES6. */
gulp.task('app', function()
{
    gulp.src(app)
        .pipe(gulp_babel({presets: ["es2015"]}))
        .pipe(gulp.dest(outputDir));
});

/* Compiles all ES6 and React sources. */
gulp.task('js', function()
{
    gulp.src(jsDir + '*.js')
        .pipe(gulp_babel({presets: ["es2015", "react"]}))
        .pipe(gulp_browserify())
        .pipe(gulp.dest(outputDir + 'public/js'));

});

gulp.task('sass', function()
{
    gulp.src(sassDir + 'style.scss')
        .pipe(gulp_sass({outputStyle: ''}).on('error', gulp_sass.logError))
        .pipe(gulp.dest(outputDir + 'public/css'));
});

gulp.task('watch', function()
{
    gulp.watch(app, ['app']);
    gulp.watch(jsDir + '*.js', ['js']);
    gulp.watch(sassDir + '*.scss', ['sass']);
});

gulp.task('default', ['app', 'js', 'sass', 'watch']);