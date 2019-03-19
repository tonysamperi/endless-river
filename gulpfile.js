/* eslint-disable */
var gulp = require("gulp"),
    minifyJs = require("gulp-uglify"),
    pump = require("pump"),
    path = require("path"),
    cleanCss = require("gulp-clean-css"),
    fs = require("fs-extra"),
    rename = require("gulp-rename"),
    runSequence = require("run-sequence")
;

const rootFolder = path.join(__dirname);
const jsSrcFolder = path.join(rootFolder, "js");
const cssSrcFolder = path.join(rootFolder, "css");
const distFolder = path.join(rootFolder, "dist");

gulp.task("src:copy", function (callback) {
    setTimeout(function () {
        gulp.src([
            jsSrcFolder + "/*.js",
            cssSrcFolder + "/*.css",
            "package.json",
            "README.md",
            "LICENCE"
        ])
        .pipe(gulp.dest(distFolder));
        callback();
    }, 500);
});

gulp.task("clean:dist", function () {
    return fs.emptyDirSync(distFolder);
});

gulp.task("minify:js", function (callback) {
    gulp.src(jsSrcFolder + "/*.js")
    .pipe(minifyJs())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(distFolder));
    callback();
});

gulp.task("minify:css", (callback) => {
    return gulp.src(cssSrcFolder + "/*.css")
    .pipe(cleanCss({compatibility: "ie8"}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(distFolder));
    callback();
});

gulp.task("build:lib", function (callback) {
    runSequence("clean:dist", "minify:js", "minify:css", "src:copy", callback);
});

gulp.task("default", ["minify:all"]);
