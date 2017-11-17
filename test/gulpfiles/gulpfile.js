import gulp from 'gulp';
import antlr4 from 'gulp-antlr4';
import {argv} from 'yargs';
import newer from '../../src/gulp-antlr4-newer';

const cwd = process.cwd();
const {object, lexer, parserDir, grammarGlob} = argv;

const options = (lexer || object) ? {lexer, parserDir} : parserDir;

const exec = () => {
  return gulp.src(grammarGlob, {base: cwd})
    .pipe(newer(options))
    .pipe(antlr4(parserDir));
};

gulp.task('default', exec);
