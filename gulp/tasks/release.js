import git      from 'gulp-git';
import deploy   from 'gulp-gh-pages';
import fs       from 'fs';

export default (gulp, config) => {
  gulp.task('publish:tag', (done) => {
    const pkg = JSON.parse(fs.readFileSync('./package.json'));
    const version = `v${pkg.version}`;
    const message = `Release ${version}`;

    git.tag(v, message, (tagErr) => {
      if (tagErr) throw tagErr;

      git.push('origin', version, (err) => {
        if (err) throw err;
        done();
      });
    });
  });

  gulp.task('publish:npm', (done) => {
    require('child_process')
      .spawn('npm', ['publish'], { stdio: 'inherit' })
      .on('close', done);
  });

  const releaseTasks = ['publish:tag', 'publish:npm'];

  if (config.example) {
    gulp.task('publish:examples', ['build:examples'], () => {
      return gulp
              .src(`${config.example.dist}/**/*`)
              .pipe(deploy());
    });
    releaseTasks.push('publish:examples');
  }

  gulp.task('release', releaseTasks);
};
