const gulp = require('gulp');
const plugins = require('gulp-load-plugins');
const browser = require('browser-sync');
const rimraf = require('rimraf');
const panini = require('panini/gulp');
const yargs = require('yargs');
const lazypipe = require('lazypipe');
const inky = require('inky');
const fs = require('fs');
const siphon = require('siphon-media-query');
const path = require('path');
const merge = require('merge-stream');
const beep = require('beepbeep');
const colors = require('colors');
const gulpSass = require('gulp-dart-sass');

const $ = plugins();

// Look for the --production flag
const PRODUCTION = !!yargs.argv.production;
const EMAIL = yargs.argv.to;

let paniniInstance;

// Build the "dist" folder by running all of the below tasks
gulp.task('build', gulp.series(clean, pages, sass, inline));

// Build emails, run the server, and watch for file changes
gulp.task('default', gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf('dist', done);
}

// Compile layouts, pages, and partials into flat HTML files
// Then parse using Inky templates
function pages() {
  const stream = panini('src').pipe(inky()).pipe(gulp.dest('dist'));
  paniniInstance = stream._panini;
  return stream;
}

// Compile Sass into CSS
function sass() {
  return gulp
    .src('src/assets/scss/app.scss')
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe(
      gulpSass({
        includePaths: ['node_modules/foundation-emails/scss'],
      }).on('error', gulpSass.logError),
    )
    .pipe(
      $.if(
        PRODUCTION,
        $.uncss({
          html: ['dist/**/*.html'],
        }),
      ),
    )
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/css'));
}

// Inline CSS and minify HTML
function inline() {
  return gulp
    .src('dist/**/*.html')
    .pipe($.if(PRODUCTION, inliner('dist/css/app.css')))
    .pipe(gulp.dest('dist'));
}

// Start a server with LiveReload to preview the site in
function server(done) {
  browser.init({
    server: 'dist',
  });
  done();
}

// Watch for file changes
function watch() {
  gulp
    .watch(['src/pages/**/*.html', 'src/layouts/**/*', 'src/partials/**/*'])
    .on('all', gulp.series(pages, inline, browser.reload));
  gulp
    .watch(['../scss/**/*.scss', 'src/assets/scss/**/*.scss'])
    .on('all', gulp.series(sass, pages, inline, browser.reload));
}

// Inlines CSS into HTML, adds media query CSS into the <style> tag of the email, and compresses the HTML
function inliner(css) {
  var css = fs.readFileSync(css).toString();
  var mqCss = siphon(css);

  var pipe = lazypipe()
    .pipe($.inlineCss, {
      applyStyleTags: true,
      removeStyleTags: true,
      preserveMediaQueries: true,
      removeLinkTags: true,
    })
    .pipe($.replace, '<!-- <style> -->', `<style>${mqCss}</style>`)
    .pipe($.replace, '<link rel="stylesheet" type="text/css" href="css/app.css">', '')
    .pipe($.htmlmin, {
      collapseWhitespace: true,
      minifyCSS: true,
    });

  return pipe();
}
