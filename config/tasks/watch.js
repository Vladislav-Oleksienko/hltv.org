import gulp from 'gulp'
import plumber from 'gulp-plumber'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import terser from 'gulp-terser'
import autoprefixer from 'gulp-autoprefixer'

import { handleError, liveEnv, project, targets } from '../index'

// Styles
const styleSrcDir = project.sourceDirectory + '/' + project.stylesDirectory
const styleDest = project.distDirectory + '/' + project.stylesDirectory
const cssFileName = project.cssMinFileName
const autoprefixerSettings = targets.autoprefixer

// JS
const jsPaths = project.sourceDirectory + '/' + project.scriptsDirectory + '/**/*.js'
const jsDest = project.distDirectory + '/' + project.scriptsDirectory
const jsFileName = project.jsMinFileName

export default function () {
  function styles () {
    return gulp
      .src(styleSrcDir + '/**/*.scss')
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(sourcemaps.init())
      .pipe(sass({
          outputStyle: 'compressed',
        })
      )
      .pipe(autoprefixer({
          overrideBrowserslist: autoprefixerSettings
        })
      )
      .pipe(concat(cssFileName))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(styleDest))
  }

  function scripts () {
    return gulp
      .src(jsPaths)
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(sourcemaps.init())
      .pipe(concat(jsFileName))
      .pipe(terser())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(jsDest))
  }

  return function () {
    gulp.watch(styleSrcDir, styles)
    gulp.watch(jsPaths, scripts)
  }
}
