'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  var parserDir = options.parserDir || options;
  var lexer = options.lexer;

  return _through2.default.obj(function (file, encoding, done) {
    var _this = this;

    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      this.emit( // eslint-disable-line no-invalid-this
      'error', new _gulpUtil.PluginError(PLUGIN_NAME, 'Streams are not supported'));
      return done();
    }

    if (file.isBuffer()) {
      var ext = _path2.default.extname(file.path);

      if (ext.toLowerCase() === '.g4') {
        var grammar = _path2.default.basename(file.path, ext);
        var parserFile = lexer ? _path2.default.join(parserDir, grammar + 'Lexer.js') : _path2.default.join(parserDir, grammar + 'Parser.js');

        return (0, _statAgain.isNewerThan)(file.path, parserFile).then(function (yes) {
          if (yes) {
            return done(null, file);
          } else {
            return done();
          }
        }, function (err) {
          if (err.message.includes('ENOENT') && err.message.includes(parserDir)) {
            return done(null, file);
          }

          _this.emit( // eslint-disable-line no-invalid-this
          'error', new _gulpUtil.PluginError(PLUGIN_NAME, err.message));

          return done();
        });
      }

      return done(null, file);
    }
  });
};

var _gulpUtil = require('gulp-util');

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _statAgain = require('stat-again');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLUGIN_NAME = 'gulp-antlr4-newer';

module.exports = exports['default'];