import {PluginError} from 'gulp-util';
import through from 'through2';
import path from 'path';
import {isNewerThan} from 'stat-again';

const PLUGIN_NAME = 'gulp-antlr4-newer';

export default function (options) {
  const parserDir = options.parserDir || options;
  const lexer = options.lexer;

  return through.obj(function (file, encoding, done) {
    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      this.emit( // eslint-disable-line no-invalid-this
        'error', new PluginError(PLUGIN_NAME, 'Streams are not supported'));
      return done();
    }

    if (file.isBuffer()) {
      const ext = path.extname(file.path);

      if (ext.toLowerCase() === '.g4') {
        const grammar = path.basename(file.path, ext);
        const parserFile = lexer ?
          path.join(parserDir, `${grammar}Lexer.js`) :
          path.join(parserDir, `${grammar}Parser.js`);

        return isNewerThan(file.path, parserFile).then(yes => {
          if (yes) {
            return done(null, file);
          } else {
            return done();
          }
        }, err => {
          if (err.message.includes('ENOENT') && err.message
            .includes(parserDir)) {
            return done(null, file);
          }

          this.emit( // eslint-disable-line no-invalid-this
            'error', new PluginError(PLUGIN_NAME, err.message));

          return done();
        });
      }

      return done(null, file);
    }
  });
}
