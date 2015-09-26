import bump from 'gulp-bump';

function getBumpTask(type) {
  return ()=> {
    return gulp.src(['./package.json', './bower.json'])
      .pipe(bump({type}))
      .pipe(gulp.dest('./'));
  };
}

export default (gulp, config)=> {
  gulp.task('bump', getBumpTask('patch'));
  gulp.task('bump:minor', getBumpTask('minor'));
  gulp.task('bump:major', getBumpTask('major'));
};
