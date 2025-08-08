/*
 Gulp build for Ghost theme

 - Processes PostCSS from assets/css/screen.css → assets/built/screen.css
 - Autoprefixes and minifies in production
 - Generates sourcemaps in development
 - Live reloads with BrowserSync (proxying local Ghost)
 - Creates distributable zip with versioned filename
*/

const { src, dest, watch, series, parallel } = require("gulp");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");
const postcssNested = require("postcss-nested");
const browserSync = require("browser-sync").create();
const zip = require("gulp-zip");
const del = require("del");
const fs = require("fs");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const paths = {
  css: {
    src: "assets/css/screen.css",
    watch: "assets/css/**/*.css",
    dest: "assets/built/",
  },
  hbs: ["**/*.hbs"],
  dist: "dist/",
};

function styles() {
  const plugins = [postcssImport(), postcssNested(), autoprefixer()];
  if (isProduction) {
    plugins.push(cssnano());
  }

  return src(paths.css.src)
    .pipe(
      isProduction
        ? require("stream").PassThrough({ objectMode: true })
        : sourcemaps.init()
    )
    .pipe(postcss(plugins))
    .pipe(
      isProduction
        ? require("stream").PassThrough({ objectMode: true })
        : sourcemaps.write(".")
    )
    .pipe(dest(paths.css.dest))
    .pipe(browserSync.stream({ match: "**/*.css" }));
}

function serve(done) {
  browserSync.init({
    proxy: "http://localhost:2368",
    open: false,
    notify: false,
    ghostMode: false,
    ui: false,
  });
  done();
}

function watcher() {
  watch(paths.css.watch, styles);
  watch(paths.hbs).on("change", browserSync.reload);
}

function cleanDist() {
  return del([paths.dist]);
}

function zipTheme() {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")));
  const filename = `${pkg.name}-${pkg.version}.zip`;

  return src(
    [
      "**/*",
      "!node_modules/**",
      "!dist/**",
      "!.git/**",
      "!.gitignore",
      "!.DS_Store",
      "!pnpm-lock.yaml",
      "!package-lock.json",
      "!yarn.lock",
      "!**/*.map",
    ],
    { dot: true }
  )
    .pipe(zip(filename))
    .pipe(dest(paths.dist));
}

const build = series(() => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  return Promise.resolve();
}, styles);
const dev = series(
  () => {
    process.env.NODE_ENV = "development";
    return Promise.resolve();
  },
  styles,
  serve,
  watcher
);
const zipTask = series(
  () => {
    process.env.NODE_ENV = "production";
    return Promise.resolve();
  },
  styles,
  cleanDist,
  zipTheme
);

exports.styles = styles;
exports.dev = dev;
exports.build = build;
exports.zip = zipTask;
