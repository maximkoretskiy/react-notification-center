var bump = require('gulp-bump');

module.exports = (gulp, config)=> {
  function getBumpTask(type) {
    return ()=> {
      return gulp.src(['./package.json', './bower.json'])
        .pipe(bump({ type: type }))
        .pipe(gulp.dest('./'));
    };
  }

  gulp.task('bump', getBumpTask('patch'));
  gulp.task('bump:minor', getBumpTask('minor'));
  gulp.task('bump:major', getBumpTask('major'));
};
