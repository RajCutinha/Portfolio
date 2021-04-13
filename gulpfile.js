import fs from "fs";
import path from "path";
import browsersync from "browser-sync";
browsersync.create();

// Gulp defaults
import gulp from "gulp";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";

// HTML support
import htmlreplace from "gulp-html-replace";
import htmlmin from "gulp-htmlmin";

// Sass support
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

// JS support
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import terser from "gulp-terser";

// Default paths
const src = path.resolve("src"),
  dist = path.resolve("dist");

const html = async () => {
  return gulp
    .src(`${src}/*.html`)
    .pipe(plumber())
    .pipe(
      htmlreplace({
        css: "./css/main.min.css",
        js: "./js/main.min.js",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeTagWhitespace: true,
        sortAttributes: true,
        sortClassName: true,
        html5: true,
      })
    )
    .pipe(gulp.dest(`${dist}`));
};

const scss = async () => {
  return gulp
    .src(`${src}/styles/**/*.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ basename: "main", suffix: ".min" }))
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(`${dist}/css`))
    .pipe(browsersync.stream());
};

const js = async () => {
  return browserify(`${src}/js/main.js`, { debug: true })
    .transform(babelify.configure({ presets: ["@babel/preset-env"] }))
    .bundle()
    .pipe(source("main.min.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${dist}/js`));
};

const assets = async () => {
  return gulp.src(`${src}/img/**`).pipe(gulp.dest(`${dist}/img`));
};

const clean = async () =>
  fs.rmdir(`${dist}`, { recursive: true }, (err) => console.log(err));

const serve = (done) => {
  browsersync.init({
    server: {
      baseDir: `${dist}`,
    },
  });
  done();
};

const reload = (done) => {
  browsersync.reload();
  done();
};

const watch = () => {
  gulp.watch(
    [`${src}/*.html`, `${src}/js/**/*.js`, `${src}/assets/**`],
    gulp.series(assets, html, js, reload)
  );

  gulp.watch([`${src}/scss/**/*.scss`], scss);
};

const dev = gulp.series(assets, html, scss, js, serve, watch);

const build = gulp.series(clean, assets, html, scss, js);

export { dev, build, clean };
