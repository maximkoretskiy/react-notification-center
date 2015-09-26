import babel  from 'gulp-babel';
import del    from 'del';

export default (gulp, config) => {
  gulp.task('clean:lib', (done) => del([config.component.lib], done) );
  const scriptSources = [
    `${config.component.src}/**/*.js`,
    '!**/__tests__/**/*',
  ];

  gulp.task('build:lib', () => {
    return gulp.src(scriptSources)
      .pipe(babel({ plugins: [require('babel-plugin-object-assign')]}))
      .pipe(gulp.dest(config.component.lib));
  });

  gulp.task('watch:lib', ['build:lib'], () => {
    return gulp.watch(scriptSources, ['build:lib']);
  });
};
