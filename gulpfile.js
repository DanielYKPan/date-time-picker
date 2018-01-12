/**
 * gulpfile
 */

(function () {
    'use strict';

    let gulp = require('gulp'),
        runSequence = require('run-sequence'),
        clean = require('gulp-clean'),
        sass = require('gulp-sass'),
        postcss = require('gulp-postcss'),
        cleancss = require('gulp-clean-css'),
        pixrem = require('pixrem'),
        autoprefixer = require('autoprefixer'),
        rename = require('gulp-rename'),
        htmlmin = require('gulp-htmlmin'),
        flatmap = require('gulp-flatmap'),
        path = require('path'),
        fs = require('fs'),
        replace = require('gulp-replace'),
        ts = require('gulp-typescript'),
        sourcemaps = require('gulp-sourcemaps'),
        merge = require('merge2'),
        Config = require('./gulpfile.config');

    let config = new Config();

    let tsDistProject = ts.createProject('tsconfig.dist.json');

    const exec = require('child_process').exec;

    gulp.task('clean', function () {
        return gulp.src(['./npmdist', config.tmpOutputPath], {read: false}).pipe(clean());
    });

    gulp.task('clean.dist', function () {
        return gulp.src(['./dist'], {read: false}).pipe(clean());
    });

    gulp.task('backup.ts.tmp', function () {
        return gulp.src(config.allTs).pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('copy.assets.to.tmp', function () {
        return gulp.src('./src/assets/**/**').pipe(gulp.dest('./tmp/assets'));
    });

    gulp.task('minify.css', function () {

        let processors = [
            pixrem(),
            autoprefixer({browsers: ['last 8 version', '> 1%', 'ie 9', 'ie 8', 'ie 7', 'ios 6', 'Firefox <= 20'], cascade: false})
        ];

        return gulp.src(config.allSass)
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(cleancss({compatibility: 'ie8'}))
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
            .pipe(gulp.dest(config.tmpOutputPath + '/assets/style'));
    });

    gulp.task('minify.html', function() {
        return gulp.src(config.allHtml)
            .pipe(htmlmin({collapseWhitespace: true, caseSensitive: true}))
            .pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('inline.template.and.styles.to.component', function () {
        return gulp.src('./tmp/**/*.component.ts')
            .pipe(flatmap(function (stream, file) {
                let tsFile = file.path;
                let htmlFile = tsFile.slice(0, -2) + 'html';
                let htmlFileName = path.parse(htmlFile).base;
                let cssFile = tsFile.slice(0, -2) + 'css';
                let scssFile = tsFile.slice(0, -2) + 'scss';
                let scssFileName = path.parse(scssFile).base;
                let styles = fs.readFileSync(cssFile, 'utf-8');
                let htmlTpl = fs.readFileSync(htmlFile, 'utf-8');

                return gulp.src([file.path])
                    .pipe(replace('styleUrls: [' + '\'' + './' + scssFileName + '\'' + '],', 'styles: [' + '`' + styles + '`' + '],'))
                    .pipe(replace('templateUrl: ' + '\'' + './' + htmlFileName + '\'' + ',', 'template: `' + htmlTpl + '`' + ','))
                    .pipe(gulp.dest(function (file) {
                        return file.base;
                    }));
            }));
    });

    gulp.task('tsc.compile.dist', function () {
        let tsResult = tsDistProject.src().pipe(sourcemaps.init()).pipe(tsDistProject());
        return merge([
            tsResult.js.pipe(gulp.dest('dist')),
            tsResult.js.pipe(sourcemaps.write('./', {includeContent: false})).pipe(gulp.dest('dist')),
            tsResult.dts.pipe(gulp.dest('dist'))
        ]);
    });

    gulp.task('bundle', function (cb) {
        var cmd = 'node_modules/.bin/rollup -c rollup.config.js dist/picker.js > tmp/picker.bundle.js';
        return run_proc(cmd, cb);
    });

    gulp.task('delete.tmp', function () {
        return gulp.src([config.tmpOutputPath], {read: false}).pipe(clean());
    });

    gulp.task('ngc', function (cb) {
        let cmd = 'node_modules/.bin/ngc -p tsconfig-aot.json';
        return run_proc(cmd, cb);
    });

    gulp.task('copy.bundle.to.dist', function () {
        return gulp.src('./tmp/picker.bundle.js').pipe(gulp.dest('./dist'));
    });

    gulp.task('copy.resources.to.dist', function () {
        return gulp.src(config.alltmpResources).pipe(gulp.dest('./dist/assets'));
    });

    gulp.task('copy.dist.to.npmdist', function () {
        return gulp.src(config.allDistFiles).pipe(gulp.dest('./npmdist'));
    });

    gulp.task('copy.root.files.to.npmdist.dir', function() {
        return gulp.src(
            [
                './index.ts',
                './index.js',
                './LICENSE',
                './package.json',
                './README.md'
            ]).pipe(gulp.dest('./npmdist'));
    });

    gulp.task('all', function (cb) {
        runSequence(
            'clean',
            'clean.dist',
            'backup.ts.tmp',
            'copy.assets.to.tmp',
            'minify.css',
            'minify.css.theme',
            'minify.html',
            'inline.template.and.styles.to.component',
            'tsc.compile.dist',
            'bundle',
            'clean.dist',
            'ngc',
            'copy.bundle.to.dist',
            'copy.resources.to.dist',
            'copy.dist.to.npmdist',
            'copy.root.files.to.npmdist.dir',
            'delete.tmp',
            cb
        )
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