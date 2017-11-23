# gulp-antlr4-newer

Gulp plugin working in combination with gulp-antlr4 to not recreate parser files when grammar is untouched

  * [Usage](#usage)
  * [License](#license)


## Usage

`gulp-antlr4-newer` gulp plugin filters` `.g4` grammar files according to timestamps. If they are newer than the corresponding parser or lexer files, they are passed through. Otherwise, they are removed from the stream.

```js
import gulp from 'gulp'
import antlr4 from 'gulp-antlr4';
import newer from 'gulp-antlr4-newer';

const grammarGlob = 'grammars/**/*.g4';
const parserDir = 'build/parsers';

gulp.task('make:parser', () => {
  // newer compares by default parserDir/*Parser.js files to parent
  // grammar files. newer expects an option as an object precising the
  // same parserDIr passed to anltr4.
  // When the grammar has been touched, then newer let it through so that
  // antlr4 will regenerate the parser files.

  return gulp.src(grammarGlob, {
    base: process.cwd(),
  })
    .pipe(newer({parserDir}))
    .pipe(antlr4(parserDir));
});

gulp.task('make:lexer', () => {
  // In case of lexer grammars, newer will compare parserDir/*Lexer.js files
  // to parent grammar files. Option {lexer: true} must be specified, because
  // missing *Parser.js would always cause the Lexer files to be regenerated

  return gulp.src(grammarGlob, {
    base: process.cwd(),
  })
    .pipe(newer({parserDir, lexer: true}))
    .pipe(antlr4(parserDir));
});

gulp.task('default', () => {
  // If a string is passed as option, it is considered to be parserDir

  return gulp.src(grammarGlob, {
    base: process.cwd(),
  })
    .pipe(newer(parserDir))
    .pipe(antlr4(parserDir));
});
```

## License

gulp-antlr4-newer is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
