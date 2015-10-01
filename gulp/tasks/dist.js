import babelify     from 'babelify';
import browserify   from 'browserify';
import del          from 'del';
import gutil        from 'gulp-util';
import rename       from 'gulp-rename';
import shim         from 'browserify-shim';
import source       from 'vinyl-source-stream';
import streamify    from 'gulp-streamify';
import uglify       from 'gulp-uglify';
import sourcemaps   from 'gulp-sourcemaps';
import buffer       from 'vinyl-buffer';
import ignore       from 'gulp-ignore';

export default (gulp, config) => {
  gulp.task('clean:dist', (done) => {
    del([config.component.dist], done);
  });

  gulp.task('build:dist:scripts', ['lint:strict'],  () => {
    const componentSource = `${config.component.src}/${config.component.file}`;
    const standalone = browserify(componentSource, {
      standalone: config.component.name,
    })
    .transform(babelify.configure({
      plugins: [require('babel-plugin-object-assign')],
    }))
    .transform(shim);

    config.component.dependencies.forEach((pkg) => standalone.exclude(pkg));

    return standalone.bundle()
      .on('error', (e) => {
        gutil.log('Browserify Error', e);
      })
      .pipe(source(config.component.pkgName + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.component.dist))
      .pipe(ignore.exclude('*.map'))
      .pipe(sourcemaps.init({
        loadMap: true,
      }))
      .pipe(streamify(uglify()))
      .pipe(rename(config.component.pkgName + '.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.component.dist));
  });
};
