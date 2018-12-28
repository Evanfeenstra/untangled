const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('make-worker', () =>
    gulp.src([
        'node_modules/@babel/standalone/babel.min.js',
        './lib/html-minifier.min.js',
        './lib/core.js',
    ])
    .pipe(concat('untangled.worker.js'))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('make-client', () =>
    gulp.src(['./lib/client.js'])
    .pipe(concat('untangled.client.js'))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('default', ['make-worker', 'make-client']);
