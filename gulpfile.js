var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  eslint = require('gulp-eslint'),
  jasmine = require('gulp-jasmine-phantom'),
  inject = require('gulp-inject'),
  replace = require('gulp-replace'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

gulp.task('default', ['copy-js-dev', 'copy-html', 'copy-index-dev', 'copy-images', 'styles', 'fonts', 'lint'], function() {
  gulp.watch('app/assets/sass/**/*.scss', ['styles']);
  gulp.watch('app/**/*.js', ['lint', 'copy-js-dev']);
  gulp.watch('app/*/**/*.html', ['copy-html']);
  gulp.watch('app/index.html', ['copy-index-dev']);
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);

  browserSync.init({
    server: 'dist',
  });
});

// Build app to dist in production-ready state
gulp.task('dist', ['js-dist', 'copy-html', 'copy-index', 'copy-images', 'fonts', 'styles']);

// Concatenate and uglify app JS; place in dist/js
gulp.task('js-dist', ['copy-js'], function() {
  gulp.src('app/**/*.js')
    .pipe(concat('bartstr.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Run ESLint on any changes to app JS
gulp.task('lint', function() {
  return gulp.src('app/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Inject locally-hosted third-party JS (e.g. Knockout) into index.html
gulp.task('copy-index-dev', ['copy-js-dev'], function() {
  gulp.src('app/index.html')
    .pipe(replace(/<!-- dev_only ([\s\S]*?)-->/g, '$1'))
    .pipe(inject(gulp.src('dist/js/lib/*.js'), {
      ignorePath: '/dist/',
      addRootSlash: false
    }))
    .pipe(gulp.dest('dist'));
});

// Add production-only CDN-hosted third-party JS to index.html and copy to dist
// Also inject any third party JS from dist/js/lib
gulp.task('copy-index', ['copy-js'], function() {
  gulp.src('app/index.html')
    .pipe(replace(/<!-- production_only ([\s\S]*?)-->/g, '$1'))
    .pipe(inject(gulp.src('dist/js/lib/*.js'), {
      ignorePath: '/dist/',
      addRootSlash: false
    }))
    .pipe(gulp.dest('dist'));
});

// Copy all non-index .html files to dist
gulp.task('copy-html', function() {
  gulp.src('app/*/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Copy any images to dist/img
gulp.task('copy-images', function() {
  gulp.src('app/assets/img/*')
    .pipe(gulp.dest('dist/img'));
});

// Copy production-ready third-party JS from bower_components into dist/js/lib
//
// Only for use in production
gulp.task('copy-js', function() {
  // TODO maybe just concat third party with bartstr? There's no angular filesort issue anymore
  var thirdPartySources = gulp.src([
    'bower_components/knockout/dist/knockout.js'
  ]);

  return thirdPartySources.pipe(gulp.dest('dist/js/lib'));
});

// Copy third-party JS from bower_components into dist/js/lib, and concatenate 
// app JS and place in dist/js
//
// Not for use in production
gulp.task('copy-js-dev', function() {
  var thirdPartySources = gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/knockout/dist/knockout.debug.js',
  ]);

  gulp.src('app/config.js')
    .pipe(gulp.dest('dist/js'));

  gulp.src(['app/**/*.js', '!app/config.js'])
    .pipe(concat('bartstr.js'))
    .pipe(gulp.dest('dist/js'));

  return thirdPartySources.pipe(gulp.dest('dist/js/lib'));
});

// Prepare .scss styles for production (minify, autoprefix) and place in dist
gulp.task('styles', function() {
  gulp.src('app/assets/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Copy fonts to dist/fonts
gulp.task('fonts', function() {
  // Third party
  gulp.src('bower_components/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest('dist/fonts/bootstrap'));

  // Local
  return gulp.src('app/assets/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

// Run Jasmine integration tests in Chrome
gulp.task('tests', function() {
  gulp.src('app/**/*_test.js')
    .pipe(jasmine({
      integration: true,
      vendor: 'app/**/*.js'
    }));
});

