var gulp = require('gulp');
var initGulpTasks = require('./index');

/**
 * Tasks are added by the react-component-gulp-tasks package
 *
 * See https://github.com/JedWatson/react-component-gulp-tasks
 * for documentation.
 *
 * You can also add your own additional gulp tasks if you like.
 */

const taskConfig = {

  component: {
    name: 'NotificationCenter',
    dependencies: [
      'classnames',
      'react',
      'react/addons',
    ],
    css: {
      path: 'css',
      entry: 'notification-center.css',
    },
    lib: 'lib',
  },

  example: {
    src: 'example/src',
    dist: 'example/dist',
    files: [
      'index.html',
      '.gitignore',
    ],
    scripts: [
      'example.js',
    ],
    css: [
      'example.css',
    ],
  },
};

initGulpTasks(gulp, taskConfig);
