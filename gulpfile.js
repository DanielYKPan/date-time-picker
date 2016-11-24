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

    var tsDistProject = ts.createProject('tsconfig.dist.json');

    var str1 = '// webpack1_';
    var str2 = '// webpack2_';
    var str3 = '/*';
    var str4 = '*/';

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
            .pipe(flatmap(function(stream, file){
                var tsFile = file.path;
                var htmlFile = tsFile.slice(0, -2) + 'html';
                var cssFile = tsFile.slice(0, -2) + 'css';
                var styles = fs.readFileSync(cssFile, 'utf-8');
                var htmlTpl = fs.readFileSync(htmlFile, 'utf-8');

                return gulp.src([file.path])
                    .pipe(replace(str1, str3))
                    .pipe(replace(str2, str4))
                    .pipe(replace('styles: [myDpStyles],', 'styles: [' + '`' + styles + '`' + '],'))
                    .pipe(replace('template: myDpTpl,', 'template: `' + htmlTpl + '`' + ','))
                    .pipe(gulp.dest(function(file) {
                        return file.base;
                    }));
            }));
    });

    gulp.task('minify.css', function () {

        var processors = [
            pixrem(),
            autoprefixer({browsers: ['last 8 version', '> 1%', 'ie 9', 'ie 8', 'ie 7', 'ios 6', 'Firefox <= 20'], cascade: false})
        ];

        return gulp.src(config.allSass)
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(cleancss({compatibility: 'ie8'}))
            .pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('minify.html', function() {
        return gulp.src(config.allHtml)
            .pipe(htmlmin({collapseWhitespace: true, caseSensitive: true}))
            .pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('clean', function () {
        return gulp.src(['./npmdist', config.tmpOutputPath], {read: false}).pipe(clean());
    });

    gulp.task('backup.ts.tmp', function () {
        return gulp.src(config.allTs).pipe(gulp.dest(config.tmpOutputPath));
    });

    gulp.task('delete.tmp', function () {
        return gulp.src([config.tmpOutputPath], {read: false}).pipe(clean());
    });

    gulp.task('copy.src.to.npmdist.dir', function() {
        return gulp.src([config.alltmpTs, '!' + config.alltmpSpecTs]).pipe(gulp.dest('./npmdist/src'));
    });

    gulp.task('copy.dist.to.npmdist.dir', function() {
        return gulp.src(config.allDistFiles).pipe(gulp.dest('./npmdist/dist'));
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
            'backup.ts.tmp',
            'minify.css',
            'minify.html',
            'inline.template.and.styles.to.component',
            'tsc.compile.dist',
            'copy.src.to.npmdist.dir',
            'copy.dist.to.npmdist.dir',
            'copy.root.files.to.npmdist.dir',
            'delete.tmp',
            cb
        )
    });
})();