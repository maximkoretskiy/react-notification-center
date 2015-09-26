var babelify = require('babelify');
var browserify = require('browserify');
var del = require('del');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var ignore = require('gulp-ignore');

module.exports = function (gulp, config) {
  gulp.task('clean:dist', function (done) {
    del([config.component.dist], done);
  });

  gulp.task('build:dist:scripts', function () {
    var standalone = browserify('./' + config.component.src + '/' + config.component.file, {
      standalone: config.component.name
    })
    .transform(babelify.configure({
      plugins: [require('babel-plugin-object-assign')]
    }))
    .transform(shim);

    config.component.dependencies.forEach(function (pkg) {
      standalone.exclude(pkg);
    });

    return standalone.bundle()
      .on('error', function (e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source(config.component.pkgName + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.component.dist))
      .pipe(ignore.exclude("*.map"))
      .pipe(sourcemaps.init({loadMap: true}))
      .pipe(streamify(uglify()))
      .pipe(rename(config.component.pkgName + '.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.component.dist));
  });

  gulp.task('build:dist', [
    'build:dist:css',
    'build:dist:scripts',
  ]);
};
