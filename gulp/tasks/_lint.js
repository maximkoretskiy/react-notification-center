import eslint from 'gulp-eslint';
import gif from 'gulp-if';

export default (gulp, config) => {
  function makeLintTask(strict) {
    return ()=> {
      return gulp.src([
        'src/**/*.js',
        'examples/**/*.js',
      ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gif(strict, eslint.failOnError()));
    };
  }
  gulp.task('lint:strict', makeLintTask(true));
  gulp.task('lint:dev', makeLintTask(false));
};
