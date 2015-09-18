var aliasify = require('aliasify');
var babelify = require('babelify');
var browserify = require('browserify');
var chalk = require('chalk');
var connect = require('gulp-connect');
var del = require('del');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var postcss = require('gulp-postcss');
var postcssUse = require('postcss-use');
var postcssPlugs = {
	autoprefixer: require('autoprefixer'),
	stylelint: require('stylelint'),
	precss: require('precss'),
	reporter: require('postcss-reporter'),
	colorFunction: require('postcss-color-function')
}

module.exports = function (gulp, config) {
	function doBundle (target, name, dest) {
		return target.bundle()
			.on('error', function (e) {
				gutil.log('Browserify Error', e);
			})
			.pipe(source(name))
			.pipe(gulp.dest(dest))
			.pipe(connect.reload());
	}

	function watchBundle (target, name, dest) {
		return watchify(target)
			.on('update', function (scriptIds) {
				scriptIds = scriptIds
					.filter(function (x) { return x.substr(0, 2) !== './'; })
					.map(function (x) { return chalk.blue(x.replace(__dirname, '')); });

				if (scriptIds.length > 1) {
					gutil.log(scriptIds.length + ' Scripts updated:\n* ' + scriptIds.join('\n* ') + '\nrebuilding...');
				} else {
					gutil.log(scriptIds[0] + ' updated, rebuilding...');
				}

				doBundle(target, name, dest);
			})
			.on('time', function (time) {
				gutil.log(chalk.green(name + ' built in ' + (Math.round(time / 10) / 100) + 's'));
			});
	}

	function buildExampleScripts (dev) {
		var dest = config.example.dist;
		var opts = dev ? watchify.args : {};
		opts.debug = !!dev;
		opts.hasExports = true;

		return function () {
			var common = browserify(opts);

			var bundle = browserify(opts);
			bundle.transform(babelify.configure({
				plugins: [require('babel-plugin-object-assign')]
			}));
			config.aliasify && bundle.transform(aliasify);
			bundle.require('./' + config.component.src + '/' + config.component.file, { expose: config.component.pkgName });

			var standalone = false;
			if (config.example.standalone) {
				standalone = browserify('./' + config.component.src + '/' + config.component.file, { standalone: config.component.name });
				standalone.transform(babelify.configure({
					plugins: [require('babel-plugin-object-assign')]
				}));
				config.aliasify && standalone.transform(aliasify);
				standalone.transform(shim);
			}

			var examples = config.example.scripts.map(function (file) {
				var fileBundle = browserify(opts);
				fileBundle.exclude(config.component.pkgName);
				fileBundle.add('./' + config.example.src + '/' + file);
				fileBundle.transform(babelify.configure({
					plugins: [require('babel-plugin-object-assign')]
				}));
				config.aliasify && fileBundle.transform(aliasify);
				return {
					file: file,
					bundle: fileBundle
				};
			});

			config.component.dependencies.forEach(function (pkg) {
				common.require(pkg);
				bundle.exclude(pkg);
				if (standalone) standalone.exclude(pkg);
				examples.forEach(function (eg) {
					eg.bundle.exclude(pkg);
				});
			});

			if (dev) {
				watchBundle(common, 'common.js', dest);
				watchBundle(bundle, 'bundle.js', dest);
				if (standalone) watchBundle(standalone, 'standalone.js', dest);
				examples.forEach(function (eg) {
					watchBundle(eg.bundle, eg.file, dest);
				});
			}

			var bundles = [
				doBundle(common, 'common.js', dest),
				doBundle(bundle, 'bundle.js', dest)
			];

			if (standalone) {
				bundles.push(doBundle(standalone, 'standalone.js', dest));
			}

			return merge(bundles.concat(examples.map(function (eg) {
				return doBundle(eg.bundle, eg.file, dest);
			})));
		};
	}

	gulp.task('clean:examples', function (done) { del([config.example.dist], done); });
	gulp.task('watch:example:scripts', buildExampleScripts(true));
	gulp.task('build:example:scripts', buildExampleScripts());

	gulp.task('build:example:files', function () {
		return gulp.src(config.example.files, { cwd: config.example.src, base: config.example.src })
			.pipe(gulp.dest(config.example.dist))
			.pipe(connect.reload());
	});



	gulp.task('build:example:css', function () {
		if (!config.example.css) return;
		var processors = [
			postcssPlugs.reporter({
        clearMessages: true,
      })
		];
		return gulp.src(config.example.src + '/' + config.example.css)
			.pipe(postcss([
        postcssPlugs.stylelint(),
        postcssPlugs.colorFunction(),
        postcssPlugs.precss(),
        postcssPlugs.autoprefixer({browsers: ['last 2 versions']}),
        postcssPlugs.reporter({})
			]))
			.pipe(gulp.dest(config.example.dist))
			.pipe(connect.reload());
	});

	gulp.task('build:examples', [
		'build:example:files',
		'build:example:css',
		'build:example:scripts'
	]);

	gulp.task('watch:examples', [
		'build:example:files',
		'build:example:css'
	], function () {
		buildExampleScripts(true)();
		gulp.watch(config.example.files.map(function (i) {
			return config.example.src + '/' + i;
		}), ['build:example:files']);

		var watchCSS = [];
		if (config.example.css) {
			watchCSS.push(config.example.src + '/' + config.example.css);
		}

		if (config.component.css && config.component.css.path) {
			watchCSS.push(config.component.css.path + '/**/*.css');
		}

		gulp.watch(watchCSS, ['build:example:css']);
	});
};
