/**
 * gulpfile
 */

(function () {
    'use strict';

    var gulp = require('gulp'),
        clean = require('gulp-clean'),
        sass = require('gulp-sass'),
        autoprefixer = require('autoprefixer'),
        postcss = require('gulp-postcss'),
        cleancss = require('gulp-clean-css'),
        rename = require('gulp-rename'),
        pixrem = require('pixrem'),
        runSequence = require('run-sequence'),
        path = require('path'),
        fs = require('fs'),
        flatmap = require('gulp-flatmap'),
        htmlmin = require('gulp-htmlmin'),
        replace = require('gulp-replace'),
        ts = require('gulp-typescript'),
        merge = require('merge2'),
        sourcemaps = require('gulp-sourcemaps'),
        Config = require('./gulpfile.config');

    var config = new Config();

    var tsDistProject = ts.createProject('tsconfig-esm.json');

    const exec = require('child_process').exec;

    gulp.task('tsc.compile.dist', function () {
        var tsResult = tsDistProject.src().pipe(sourcemaps.init()).pipe(tsDistProject());
        return merge([
            tsResult.js.pipe(gulp.dest('dist')),
            tsResult.js.pipe(sourcemaps.write('./', {includeContent: false})).pipe(gulp.dest('dist')),
            tsResult.dts.pipe(gulp.dest('dist'))
        ]);
    });

    gulp.task('inline.template.and.styles.to.component', function () {
        return gulp.src('./tmp/**/*.component.ts')
            .pipe(flatmap(function (stream, file) {
                var tsFile = file.path;
                var htmlFile = tsFile.slice(0, -2) + 'html';
                var htmlFileName = path.parse(htmlFile).base;
                var cssFile = tsFile.slice(0, -2) + 'css';
                var scssFile = tsFile.slice(0, -2) + 'scss';
                var scssFileName = path.parse(scssFile).base;
                var styles = fs.readFileSync(cssFile, 'utf-8');
                var htmlTpl = fs.readFileSync(htmlFile, 'utf-8');

                return gulp.src([file.path])
                    .pipe(replace('styleUrls: [' + '\'' + './' + scssFileName + '\'' + '],', 'styles: [' + '`' + styles + '`' + '],'))
                    .pipe(replace('templateUrl: ' + '\'' + './' + htmlFileName + '\'' + ',', 'template: `' + htmlTpl + '`' + ','))
                    .pipe(gulp.dest(function (file) {
                        return file.base;
                    }));
            }));
    });

    gulp.task('minify.css', function () {

        var processors = [
            pixrem(),
            autoprefixer({
                browsers: ['last 8 version', '> 1%', 'ie 9', 'ie 8', 'ie 7', 'ios 6', 'Firefox <= 20'],
                cascade: false
            })
        ];

        return gulp.src(config.allSass)
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(cleancss({compatibility: 'ie8'}))
            .pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('minify.html', function () {
        return gulp.src(config.allHtml)
            .pipe(htmlmin({collapseWhitespace: true, caseSensitive: true}))
            .pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('minify.css.theme', function () {
        var processors = [
            pixrem(),
            autoprefixer({browsers: ['last 8 version', '> 1%', 'ie 9', 'ie 8', 'ie 7', 'ios 6', 'Firefox <= 20'], cascade: false})
        ];

        return gulp.src('./src/sass/picker.scss')
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(cleancss({compatibility: 'ie8'}))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(config.tmpOutputPath + '/style'));
    });

    gulp.task('clean', function () {
        return gulp.src(['./dist', './npmdist', config.tmpOutputPath], {read: false}).pipe(clean());
    });

    gulp.task('clean.dist', function () {
        return gulp.src(['./dist'], {read: false}).pipe(clean());
    });

    gulp.task('backup.ts.tmp', function () {
        return gulp.src(config.allTs).pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('delete.tmp', function () {
        return gulp.src([config.tmpOutputPath], {read: false}).pipe(clean());
    });

    gulp.task('copy.src.to.npmdist.dir', function () {
        return gulp.src([config.alltmpTs, '!' + config.alltmpSpecTs]).pipe(gulp.dest('./npmdist/src'));
    });

    gulp.task('copy.dist.to.npmdist', function () {
        return gulp.src(config.allDistFiles).pipe(gulp.dest('./npmdist'));
    });

    gulp.task('copy.assets.to.dist.assets', function () {
        return gulp.src(config.allAssets).pipe(gulp.dest('./dist/assets'));
    });

    gulp.task('copy.root.files.to.npmdist.dir', function () {
        return gulp.src(
            [
                './index.ts',
                './index.js',
                './LICENSE',
                './package.json',
                './README.md'
            ]).pipe(gulp.dest('./npmdist'));
    });

    gulp.task('copy.bundle.to.dist', function () {
        return gulp.src('./tmp/picker.bundle.js').pipe(gulp.dest('./dist'));
    });

    gulp.task('copy.resources.to.dist.assets', function () {
        return gulp.src('./tmp/style/**').pipe(gulp.dest('./dist/assets/style'));
    });

    gulp.task('bundle', function (cb) {
        var cmd = 'node_modules/.bin/rollup -c rollup.config.js dist/picker.js > tmp/picker.bundle.js';
        return run_proc(cmd, cb);
    });

    gulp.task('all', function (cb) {
        runSequence(
            'clean',
            'backup.ts.tmp',
            'minify.css',
            'minify.css.theme',
            'minify.html',
            'inline.template.and.styles.to.component',
            'tsc.compile.dist',
            'bundle',
            'clean.dist',
            'ngc',
            'copy.bundle.to.dist',
            'copy.assets.to.dist.assets',
            'copy.resources.to.dist.assets',
            'copy.dist.to.npmdist',
            'copy.root.files.to.npmdist.dir',
            'delete.tmp',
            cb
        )
    });

    gulp.task('ngc', function (cb) {
        var cmd = 'node_modules/.bin/ngc -p tsconfig-aot.json';
        return run_proc(cmd, cb);
    });

    const run_proc = function (cmd, callBack, options) {
        var proc = exec(cmd, function (err, stdout, stderr) {
            if (options === undefined) options = {};
            if (options.outFilter !== undefined) stdout = options.outFilter(stdout);
            if (options.errFilter !== undefined) stderr = options.errFilter(stderr);
            process.stdout.write(stdout);
            process.stdout.write(stderr);
            callBack(err);
        });
    };
})();