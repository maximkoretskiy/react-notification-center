import postcss        from 'gulp-postcss';
import gif            from 'gulp-if';
import connect        from 'gulp-connect';
import sourcemaps     from 'gulp-sourcemaps';
import autoprefixer   from 'autoprefixer';
import stylelint      from 'stylelint';
import precss         from 'precss';
import reporter       from 'postcss-reporter';
import colorFunction  from 'postcss-color-function';

export default (gulp, config) => {
  function buildStyles(opts = {}) {
    const {
      watch,
      sourcePath,
      destPath,
    } = opts;
    if (!config.example.css) return ()=>{};
    return ()=> {
      // TODO: require plugins inline
      const plugins = [
        stylelint(),
        colorFunction(),
        precss(),
        autoprefixer({browsers: ['last 2 versions']}),
        reporter(),
      ];
      return gulp.src(sourcePath)
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destPath))
        .pipe(gif(watch, connect.reload()));
    };
  }


  gulp.task(
            'build:example:css',
            buildStyles({
              watch: true,
              sourcePath: `${config.example.src}/${config.example.css}`,
              destPath: config.example.dist,
            })
          );
  gulp.task(
            'build:dist:css',
            buildStyles({
              watch: false,
              sourcePath: `${config.component.css.path}/${config.component.css.entry}`,
              destPath: 'dist',
            })
          );
};
