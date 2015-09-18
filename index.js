import defaults from 'defaults';
import capitalize from 'capitalize';
import camelCase from 'camelcase';
import fs from 'fs';

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

/**
 * This package exports a function that binds tasks to a gulp instance
 * based on the provided config.
 */
function initTasks(gulp, config) {
  const pkg = readPackageJSON();
  const name = capitalize(camelCase(config.component.pkgName || pkg.name));

  config = defaults(config, {aliasify: pkg.aliasify });
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
  require('./tasks/dev')(gulp, config);
  require('./tasks/dist')(gulp, config);
  require('./tasks/release')(gulp, config);

  const buildTasks = ['build:dist'];
  const cleanTasks = ['clean:dist'];

  if (config.component.lib) {
    require('./tasks/lib')(gulp, config);
    buildTasks.push('build:lib');
    cleanTasks.push('clean:lib');
  }

  if (config.example) {
    require('./tasks/examples')(gulp, config);
    buildTasks.push('build:examples');
    cleanTasks.push('clean:examples');
  }

  gulp.task('build', buildTasks);
  gulp.task('clean', cleanTasks);
}

module.exports = initTasks;
module.exports.readPackageJSON = readPackageJSON;
