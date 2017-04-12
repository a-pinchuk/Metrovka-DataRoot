"use strict"

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    pug = require('gulp-pug'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: ['src/style/style.scss', 'src/style/partials/*.scss', '!src/style/partials/main.scss'],
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
    // ,
    // popup: 'src/style/popup.scss'
};


gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(concat('main.scss'))
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

// gulp.task('style:popup', function () {
//     gulp.src(path.popup) //Выберем наш popup.scss
//         .pipe(sourcemaps.init()) //То же самое что и с js
//         .pipe(sass()) //Скомпилируем
//         .pipe(prefixer()) //Добавим вендорные префиксы
//         .pipe(cssmin()) //Сожмем
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(path.build.css)) //И в build
//         .pipe(reload({stream: true}));
// });

// gulp.task('image:build', function () {
//     gulp.src(path.src.img) //Выберем наши картинки
//         .pipe(imagemin({ //Сожмем их
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()],
//             interlaced: true
//         }))
//         .pipe(gulp.dest(path.build.img)) //И бросим в build
//         .pipe(reload({stream: true}));
// });

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    // watch([path.watch.js], function(event, cb) {
    //     gulp.start('js:build');
    // });
    // watch([path.watch.img], function(event, cb) {
    //     gulp.start('image:build');
    // });
    //  watch([path.watch.style], function(event, cb) {
    //     gulp.start('style:popup');
    // });
    // watch([path.watch.fonts], function(event, cb) {
    //     gulp.start('fonts:build');
    // });
});

gulp.task('build', [
    'html:build',
    //'js:build',
    'style:build',
    // 'style:popup',
    //fonts:build',
   // 'image:build'
]);

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build',   'watch']);