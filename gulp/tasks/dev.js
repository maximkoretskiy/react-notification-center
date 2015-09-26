import connect  from 'gulp-connect';
import path     from 'path';

export default (gulp, config) => {
  gulp.task('dev:server', () => {
    connect.server({
      root: config.example.dist,
      fallback: path.join(config.example.dist, 'index.html'),
      port: 8000,
      livereload: true,
    });
  });
};
