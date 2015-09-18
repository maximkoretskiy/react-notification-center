var babelify = require('babelify');
var browserify = require('browserify');
var del = require('del');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var postcssPlugs = {
	autoprefixer: require('autoprefixer'),
	stylelint: require('stylelint'),
	precss: require('precss'),
	reporter: require('postcss-reporter'),
	colorFunction: require('postcss-color-function')
}


module.exports = function (gulp, config) {
	gulp.task('clean:dist', function (done) {
		del([config.component.dist], done);
	});

	gulp.task('build:dist:scripts', function () {
		var standalone = browserify('./' + config.component.src + '/' + config.component.file, {
			standalone: config.component.name
		})
		.transform(babelify.configure({
			plugins: [require('babel-plugin-object-assign')]
		}))
		.transform(shim);

		config.component.dependencies.forEach(function (pkg) {
			standalone.exclude(pkg);
		});

		return standalone.bundle()
			.on('error', function (e) {
				gutil.log('Browserify Error', e);
			})
			.pipe(source(config.component.pkgName + '.js'))
			.pipe(gulp.dest(config.component.dist))
			.pipe(rename(config.component.pkgName + '.min.js'))
			.pipe(streamify(uglify()))
			.pipe(gulp.dest(config.component.dist));
	});

	var buildTasks = ['build:dist:scripts'];


	if (config.component.css && config.component.css.entry) {
		var processors = [
			postcssPlugs.stylelint(),
			postcssPlugs.colorFunction(),
			postcssPlugs.precss(),
			postcssPlugs.autoprefixer({browsers: ['last 2 versions']}),
			postcssPlugs.reporter({})
		];
		gulp.task('build:dist:css', ['clean:dist'], function () {
			return gulp.src(config.component.css.path + '/' + config.component.css.entry)
				.pipe(postcss(processors))
				.pipe(gulp.dest('dist'));
		});
		buildTasks.push('build:dist:css');
	}

	gulp.task('build:dist', buildTasks);
};
