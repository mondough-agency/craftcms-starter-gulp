// Gulp packages
var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	jshint 			= require('gulp-jshint'),
	concat 			= require('gulp-concat'),
	sass 			= require('gulp-sass'),
	sourcemaps 		= require('gulp-sourcemaps'),
	browserSync 	= require('browser-sync').create(),
	imagemin 		= require('gulp-imagemin'),
	newer 			= require('gulp-newer');

//
//	Settings
//
var sourceDir 		= './source';
var destDir 		= './public/assets';
var templateDir 	= './craft/templates';

var src = {
	jsFiles: 		sourceDir + '/js/**/*.js',
	styleFiles: 	sourceDir + '/scss/**/*.scss',
	htmlFiles: 		sourceDir + '/**/*.html',
	imageFiles: 	sourceDir + '/img/**/*'
}

var dest = {
	jsFolder: 		destDir + '/js',
	styleFolder: 	destDir + '/css',
	htmlFolder: 	templateDir,
	imageFolder: 	destDir + '/img'
}

// Naming

// name of bundled js file
var bundleJsName 	= 'bundle.js';
var proxieUrl 		= 'localhost:8888'; // put your 'mycraft.local' here

//
//	Tasks
//
// Default Task run by "$ gulp"
gulp.task('default', ['build', 'serve', 'watch'], function() {
	// set enviroment var
	return process.env.type = 'development';
});

gulp.task('build', ['jshint', 'build-js', 'build-css', 'copy-html', 'imagemin'], function() {
	// set enviroment var
	return process.env.type = 'production';
});

//
//	JS
//
// jshint config
gulp.task('jshint', function() {
	return gulp.src(src.jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// concat js files and conditionaly uglify it
gulp.task('build-js', function() {
	return gulp.src(src.jsFiles)
	.pipe(sourcemaps.init())
		.pipe(concat(bundleJsName))
		// condition if (enviroment variable) type equals 'production'
		.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(dest.jsFolder));
})

//
//	Styles
//
// build css out or sass
gulp.task('build-css', function() {
	return gulp.src(src.styleFiles)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest.styleFolder));
});

//
// 	Templates / HTML
// 	
// 	Copy Template to the template Folder
gulp.task('copy-html', function() {
	return gulp.src(src.htmlFiles)
		.pipe(gulp.dest(dest.htmlFolder));
});

//
// 	Server
// 		
// Static server
// ToDo: Test with real Craft Dev
// 	- script and style injecting
gulp.task('serve', function() {
	browserSync.init({
		proxy: proxieUrl
	});
});

gulp.task('reload', function() {
	browserSync.reload();
});

//
// Images
// 
// Copy image assets and compress them if they are new
gulp.task('imagemin', function() {
	return gulp.src(src.imageFiles)
		.pipe(newer(dest.imageFolder))
		.pipe(imagemin())
		.pipe(gulp.dest(dest.imageFolder))
});

//
// Watch
// 
// Defining which files get watched
gulp.task('watch', function() {
	gulp.watch(src.jsFiles, ['jshint','build-js', 'reload']);
	gulp.watch(src.styleFiles, ['build-css', 'reload']);
	gulp.watch(src.htmlFiles, ['copy-html', 'reload']);
	gulp.watch(src.imageFiles, ['imagemin', 'reload']);
});