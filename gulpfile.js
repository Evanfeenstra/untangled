const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('make-sw', () =>
    gulp.src([
        'node_modules/@babel/standalone/babel.min.js',
        './lib/core.js',
    ])
    .pipe(concat('untangled.sw.js'))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('make-client', () =>
    gulp.src(['./lib/client.js'])
    .pipe(concat('untangled.client.js'))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('default', ['make-sw', 'make-client']);
