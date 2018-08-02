const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const webserver = require('gulp-webserver');
const htmlclean = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('sass', function () {
    return gulp.src('dev/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('images', function () {
    return gulp.src('dev/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('temp/images'))
});

gulp.task('json', function () {
    return gulp.src("dev/**/*.json").pipe(gulp.dest("temp"));
})

gulp.task('html', function () {
    return gulp.src("dev/index.html").pipe(gulp.dest("temp"));
});

gulp.task('css', function () {
    return gulp.src("dev/**/*.css").pipe(gulp.dest("temp"));
});

gulp.task('js', function () {
    return gulp.src('dev/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('temp'))
});

gulp.task('copy', ['sass', 'css', 'js', 'html', 'images', 'json']);


gulp.task('inject', ['copy'], function () {
    const css = gulp.src('temp/**/*.css');
    const js = gulp.src('temp/**/*.js');
    return gulp.src('temp/index.html')
        .pipe(inject(css, {
            relative: true
        }))
        .pipe(inject(js, {
            relative: true
        }))
        .pipe(gulp.dest("temp"));
});

gulp.task('serve', ['inject'], function () {
    return gulp.src('temp')
        .pipe(webserver({
            port: 3000,
            livereload: true
        }));
});

gulp.task('watch', ['serve'], function () {
    gulp.watch('dev/**', ['inject']);
});

gulp.task('html:dist', function () {
    return gulp.src("dev/index.html")
        .pipe(htmlclean())
        .pipe(gulp.dest("docs"));
})

gulp.task('css:dist', function () {
    return gulp.src("dev/**/*.css")
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest("docs/styles"));
})


gulp.task('js:dist', function () {
    return gulp.src('dev/**/*.js')
        .pipe(concat('script.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('docs/scripts'))
});

gulp.task('images:dist', function () {
    return gulp.src('dev/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest("docs"))
});

gulp.task('json:dist', function () {
    return gulp.src("dev/**/*.json").pipe(gulp.dest("docs"));
})


gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'images:dist', 'json:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src("docs/**/*.css");
    var js = gulp.src("docs/**/*.js");
    return gulp.src("docs/index.html")
        .pipe(inject(css, {
            relative: true
        }))
        .pipe(inject(js, {
            relative: true
        }))
        .pipe(gulp.dest("docs"));
});

gulp.task('build', ['inject:dist']);

gulp.task('clean', function () {
    del(['temp', 'docs']);
});