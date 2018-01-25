var gulp = require('gulp');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var merge = require('merge-stream');
var concat = require('gulp-concat');

var PATHS = {
  build: {
    build: 'build/',
    css: 'build/css',
    js: 'build/js'
  },
  source: {
    source: 'source/',
    styles: 'source/styles/',
    scripts: 'source/scripts/',
    pages: 'source/pages/',
    templates: 'source/templates/'
  }
};


gulp.task('templates', function(){
  return gulp.src(PATHS.source.source+'**/*.html')
    .pipe(newer(PATHS.build.build))
    .pipe(gulp.dest(PATHS.build.build))
    .pipe(browserSync.stream());
});

gulp.task('styles', function(){

  var sassStream, cssStream;

  sassStream = gulp.src(PATHS.source.styles+'main.scss')
    .pipe(sass({
      includePaths: [
        'bower_components/normalize-scss',
        'node_modules/susy/sass'
      ],
      outputStyle: 'compressed'
    }).on('error', sass.logError));

    cssStream = gulp.src([
      'bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
      'bower_components/owl.carousel/dist/assets/owl.theme.default.min.css'
    ]);

    return merge(sassStream, cssStream)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest(PATHS.build.css))
      .pipe(browserSync.stream());

});

gulp.task('build', ['styles', 'render'], function(){
  console.log('The project has been built');
});

gulp.task('render', function(){
  return gulp.src(PATHS.source.pages+'**/*.nunjucks')
    .pipe(nunjucksRender({
      path: [PATHS.source.templates]
    }))
    .pipe(gulp.dest(PATHS.build.build))
    .pipe(browserSync.stream());
});

gulp.task('server', ['build'], function(){

  // gulp.watch(PATHS.source.source+'**/*.html', ['templates']);
  gulp.watch(PATHS.source.source+'**/*.scss', ['styles']);
  gulp.watch(PATHS.source.source+'**/*.nunjucks', ['render']);

  browserSync.init({
    server: PATHS.build.build
    // server: {
    //   baseDir: PATHS.build.build
    // }
  });

});
