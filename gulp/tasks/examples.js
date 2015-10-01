import aliasify       from 'aliasify';
import babelify       from 'babelify';
import browserify     from 'browserify';
import chalk          from 'chalk';
import connect        from 'gulp-connect';
import del            from 'del';
import gutil          from 'gulp-util';
import merge          from 'merge-stream';
import source         from 'vinyl-source-stream';
import watchify       from 'watchify';

export default (gulp, config) => {
  function processBundle(bundle, name, dest) {
    return bundle.bundle()
      .on('error', (e) => gutil.log('Browserify Error', e) )
      .pipe(source(name))
      .pipe(gulp.dest(dest))
      .pipe(connect.reload());
  }

  function watchBundle(bundle, name, dest) {
    return watchify(bundle)
      .on('update', (updatedScripts) => {
        gulp.start('lint:dev');
        const decoratedScriptList =
          updatedScripts
          .filter(  (file) => file.substr(0, 2) !== './' )
          .map(     (file) => chalk.blue(file.replace(__dirname, '')));

        if (decoratedScriptList.length > 1) {
          gutil.log(`${decoratedScriptList.length} Scripts updated:\n* ${scriptIds.join('\n* ')}\nrebuilding...`);
        } else {
          gutil.log(`${decoratedScriptList[0]} + ' updated, rebuilding...`);
        }

        processBundle(bundle, name, dest);
      })
      .on('time', (time) => {
        gutil.log(chalk.green(name + ' built in ' + (Math.round(time / 10) / 100) + 's'));
      });
  }

  function createBundle(opts) {
    const bundle = browserify(opts);
    bundle.transform(babelify.configure({
      plugins: [require('babel-plugin-object-assign')],
    }));
    config.aliasify && bundle.transform(aliasify);
    return bundle;
  }

  function getExamplesBundles(opts) {
    return config.example.scripts.map((file) => {
      const fileBundle = createBundle(opts);
      fileBundle.exclude(config.component.pkgName);
      fileBundle.add(`./${config.example.src}/${file}`);
      return {
        file: file,
        bundle: fileBundle,
      };
    });
  }

  function buildExampleScripts(dev) {
    const opts = dev ? watchify.args : {};
    opts.debug = !!dev;
    opts.hasExports = true;

    return () => {
      const common = browserify(opts);
      const bundle = createBundle(opts);
      bundle.require(
        `./${config.component.src}/${config.component.file}`,
        { expose: config.component.pkgName });
      const examples = getExamplesBundles(opts);

      config.component.dependencies.forEach((pkg) => {
        common.require(pkg);
        bundle.exclude(pkg);
        examples.forEach((eg) => eg.bundle.exclude(pkg));
      });

      const bundles = [
        {bundle: common, file: 'common.js'},
        {bundle: bundle, file: 'bundle.js'},
      ].concat(examples);

      const dest = config.example.dist;
      if (dev) {
        bundles.forEach((b) => watchBundle(b.bundle, b.file, dest));
      }

      return merge(
        bundles.map((b) => processBundle(b.bundle, b.file, dest))
      );
    };
  }
  gulp.task('clean:examples', (done) => del([config.example.dist], done) );
  gulp.task('watch:example:scripts',   buildExampleScripts(true));
  gulp.task('build:example:scripts', buildExampleScripts());

  gulp.task('build:example:files', () => {
    return gulp.src(config.example.files, {
      cwd: config.example.src,
      base: config.example.src,
    })
		.pipe(gulp.dest(config.example.dist))
		.pipe(connect.reload());
  });

  gulp.task('watch:examples', [
    'build:example:files',
    'build:example:css',
  ], () => {
    buildExampleScripts(true)();
    const fileSources = config.example.files.map((i) => config.example.src + '/' + i);
    gulp.watch(fileSources, ['build:example:files']);

    const watchCSS = [];
    if (config.example.css) {
      watchCSS.push(`${config.example.src}/${config.example.css}`);
    }
    if (config.component.css && config.component.css.path) {
      watchCSS.push(`${config.component.css.path}/**/*.css`);
    }

    gulp.watch(watchCSS, ['build:example:css']);
  });
};
