/*
	For sass files and gulp oа 4th version
*/

//const imageminMozjpeg 	= require('imagemin-mozjpeg');				// Сжатие .jpg .png .svg с потерей качества
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');				// Автопрефиксы для старых браузеров
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');			// Синфхронизация index.html с браузером	
const cleanCSS = require('gulp-clean-css');				// Сжатие .css
const imagemin = require('gulp-imagemin');					// Сжатие .jpg
//const pngquant 			= require('imagemin-pngquant');				// Сжатие .png
const uglify = require('gulp-uglify');					// Сжатие js файлов
const rename = require('gulp-rename');					// Переименовывать файлы
const concat = require('gulp-concat');					// Конкатинировать несколько файлов
const preproc = require('gulp-sass');						// Трансляция .sass файлов в .css
const cache = require('gulp-cache');					// Добавление в кэш файлов
const babel = require('gulp-babel');
const gulp = require('gulp');
const del = require('del');							// Удаление дерикторий - файлов

//#region config

let config = {
	release: {
		current: './release',
		styles: '/assets/style',
		scripts: '/assets/scripts',
		images: '/assets/images'
	},
	src: './src',
	css: {
		watch: '/assets/prestyles/**/*.sass',
		src: '/assets/prestyles/style.sass',
		libs: '/assets/prestyles/libs/**/*.css',
		dest: '/assets/style'
	},
	js: {
		src: '/assets/prescripts/**/*.js',
		dest: '/assets/scripts',
		libs: '/assets/prescripts/libs/*.js',
		main: '/assets/prescripts/common.js'
	},
	html: '/*.html',
	img: {
		src: '/assets/preimages/**/*',
		dest: '/assets/images/'
	}
}

//#endregion

//#region styles
function lib_styles() {
	return gulp.src(config.src + config.css.libs)
		.pipe(concat('libs.min.css'))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(gulp.dest(config.src + config.css.dest))
}
function main_style() {
	return gulp.src(config.src + config.css.src)
		.pipe(sourcemaps.init())
		.pipe(preproc())
		.pipe(gcmq())
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS({ level: 2 }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.', {
			mapFile: function (mapFilePath) {
				// source map files are named *.map instead of *.js.map
				return mapFilePath.replace('.min.map', '.map');
			}
			}))
		.pipe(gulp.dest(config.src + config.css.dest))
		.pipe(browserSync.stream())
}
//#endregion

//#region scripts

function libs_script() {
	return gulp.src(config.src + config.js.libs)
		.pipe(concat('libs.min.js'))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(config.src + config.js.dest))
}

function main_script() {
	return gulp.src(config.src + config.js.main)
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(config.src + config.js.dest))
		.pipe(browserSync.reload({ stream: true }))
}

//#endregion

//#region images

gulp.task('img-compress', function () {
	return gulp.src(['!' + config.src + '/assets/preimages/**/*.pdn', config.src + config.img.src])
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }]
		})))
		.pipe(gulp.dest(config.src + config.img.dest))
		.pipe(browserSync.reload({ stream: true }))
})

/*gulp.task('high-img-compress', function(){
	gulp.src(config.src + config.img.src)
        .pipe(imagemin([
			imageminMozjpeg({
                quality: 50
            })
		]))
        .pipe(gulp.dest(config.src + config.img.dest))
})*/

//#endregion

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('code', function () {
	return gulp.src(config.src + config.html)
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('clear-cache', function (callback) {
	return cache.clearAll();
})
/////////////////////
gulp.task('styles', gulp.series(lib_styles, main_style))
gulp.task('scripts', gulp.series(libs_script, main_script))

gulp.task('watch', function () {
	gulp.watch(config.src + config.css.watch, gulp.series('styles'));
	gulp.watch(config.src + config.js.src, gulp.series('scripts'))
	gulp.watch(config.src + config.img.src, gulp.series('img-compress'));
	gulp.watch(config.src + config.html, gulp.parallel('code'));
});
gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));
/////////////////////
gulp.task('del-release', function () {
	return del.sync(config.release.current);
});

gulp.task('build', gulp.parallel('styles', 'scripts', 'img-compress', 'del-release', () => {
	var style = gulp.src(config.src + config.css.dest + '/**/*')
		.pipe(gulp.dest(config.release.current + config.release.styles));
	var script = gulp.src(config.src + config.js.dest + '/**/*')
		.pipe(gulp.dest(config.release.current + config.release.scripts));
	var images = gulp.src(config.src + config.img.dest + '/**/*')
		.pipe(gulp.dest(config.release.current + config.release.images))
	var html = gulp.src(config.src + '/*.html')
		.pipe(gulp.dest(config.release.current))
}));




gulp.task('default', gulp.parallel('styles', 'scripts', 'img-compress', 'browser-sync', 'watch'));