var config = {
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

export default config;
