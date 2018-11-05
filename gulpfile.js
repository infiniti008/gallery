const fs = require('fs');
const through = require('through2');
const gulp = require('gulp');
const encryption = require('encryption-gulp');
const inlineCss = require('gulp-inline-css');
const fileinclude = require('gulp-file-include');
const watch = require('gulp-watch');
const rename = require('gulp-rename');

const password = fs.readFileSync('password.txt').toString();

gulp.task('encrypt-src', () => {
    console.log('ENCRYPT task starting');
    gulp.src(['src/**/*', '!src/functions/node_modules'])
        .pipe(encryption({
            password: password,
            decrypt: false,
        }))
    .pipe(gulp.dest('src-enc'));
});

gulp.task('decrypt-src', function() {
    gulp.src('src-enc/**/*')
        .pipe(encryption({
            password: password,
            decrypt: true,
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('build', () => {
    gulp.start(['build-home']);
});

gulp.task('inline-css', () => {
    return gulp.src('src/**/*.html')
        .pipe(inlineCss({
            	applyStyleTags: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('build-home', () =>   {
    gulp.src(['src/home/index.html'])
        .pipe(fileinclude({
            prefix: '//js'
        }))
        .pipe(inlineCss())
        .pipe(gulp.dest('./'));
});

gulp.task('build-page', () =>   {
    gulp.src(['src/**/*.html', '!src/home/index.html', '!src/funtions'])
        .pipe(fileinclude({
            prefix: '//js'
        }))
        .pipe(inlineCss())
        .pipe(encryption({
            password: password,
            decrypt: true,
        }))
        .pipe(rename(function (path, file) {            
            path.basename = path.dirname;
            path.dirname = 'pages';
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
    return gulp.watch('src/**/*', ['build'])
});


