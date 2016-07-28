import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as postcss from 'gulp-postcss';
import * as sass from 'gulp-sass';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';

import * as project from '../aurelia.json';
import {build} from 'aurelia-cli';

export default function processCSS() {
  let processors = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano
  ];

  return gulp.src(project.cssProcessor.source)
    .pipe(changedInPlace({firstPass:true}))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
};
