import gulp from 'gulp';
import defaults from 'defaults';
import capitalize from 'capitalize';
import camelCase from 'camelcase';
import fs from 'fs';
import gulpconfig from '../.gulpconfig';

// Extract package.json metadata
function readPackageJSON() {
  const pkg = JSON.parse(fs.readFileSync('./package.json'));
  const dependencies = Object.keys(pkg.dependencies);
  const peerDependencies = Object.keys(pkg.peerDependencies);

  return {
    name: pkg.name,
    deps: dependencies.concat(peerDependencies),
    aliasify: pkg.aliasify,
  };
}


const pkg = readPackageJSON();
const name = capitalize(camelCase(gulpconfig.component.pkgName || pkg.name));

const config = defaults(gulpconfig, {aliasify: pkg.aliasify });
config.component = defaults(config.component, {
  pkgName: pkg.name,
  dependencies: pkg.deps,
  name: name,
  src: 'src',
  lib: 'lib',
  dist: 'dist',
  file: (config.component.name || name) + '.js',
});

if (config.example) {
  if (config.example === true) config.example = {};

  defaults(config.example, {
    src: 'example/src',
    dist: 'example/dist',
    files: ['index.html'],
    scripts: ['example.js'],
    less: ['example.less'],
  });
}

require('./tasks/bump')(gulp, config);
/*
  tasks:
    bump
    bump:minor
    bump:major
*/
require('./tasks/dev')(gulp, config);
/*
  tasks: dev:server
*/
require('./tasks/dist')(gulp, config);
/*
  tasks:
    build:dist:scripts
    clean:dist
*/
require('./tasks/release')(gulp, config);
require('./tasks/_styles')(gulp, config);
require('./tasks/_lint')(gulp, config);

gulp.task('dev', [
  'dev:server',
  'watch:examples',
  'lint:dev',
]);

gulp.task('build:dist', [
  'build:dist:css',
  'build:dist:scripts',
]);

gulp.task('build:examples', [
  'build:example:files',
  'build:example:css',
  'build:example:scripts',
]);

const buildTasks = ['build:dist'];
const cleanTasks = ['clean:dist'];

if (config.component.lib) {
  require('./tasks/lib')(gulp, config);
  buildTasks.push('build:lib');
  cleanTasks.push('clean:lib');
}

if (config.example) {
  require('./tasks/examples')(gulp, config);
  /*
    tasks:
      clean:examples
      build:examples
  		build:example:css
      build:example:scripts
      build:example:files
  */
  buildTasks.push('build:examples');
  cleanTasks.push('clean:examples');
}

gulp.task('build', buildTasks);
gulp.task('clean', cleanTasks);
