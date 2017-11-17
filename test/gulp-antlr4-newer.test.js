import childProcessData, {makeSingleTest} from 'child-process-data';
import {tmpDir} from 'cleanup-wrapper';
import {Stator, expectEventuallyFound,
  expectEventuallyDeleted} from 'stat-again';
import {spawn} from 'child_process';
import path from 'path';
import {expect} from 'chai';
import del from 'del';

describe('Testing gulp-antlr4-newer', function () {
  this.timeout(10000); // eslint-disable-line no-invalid-this
  const parserDir = 'build/parsers';
  const grammarGlob = 'test/grammars/Line.g4';
  const grammar = 'Line';

  const testArgument = (...opts) => {
    return tmpDir(parserDir, function () {
      const gulpfile = path.join(__dirname, 'gulpfiles/gulpfile.js');
      const args = [
        '--gulpfile',
        gulpfile,
        '--cwd',
        process.cwd(),
        '--parserDir',
        parserDir,
        '--grammarGlob',
        grammarGlob,
      ].concat(opts);

      const parserFile = args.includes('--lexer') ?
        path.join(parserDir, `${grammar}Lexer.js`) :
        path.join(parserDir, `${grammar}Parser.js`);

      const gStator = new Stator(grammarGlob);
      const pStator = new Stator(parserFile);
      let pStats;

      const test = makeSingleTest({
        childProcess: ['gulp', args],
        checkResults (result) {
          // ANTLR4 should not recreate the parser files
          return pStator.stat().then(stats => {
            expect(stats.mtime).to.eql(pStats.mtime);
            pStats = stats;
          });
        },
      });

      return childProcessData(spawn('gulp', args)).then(res => {
        // ANTLR4 should have created parser files in parserDir
        return expectEventuallyFound(parserFile);
      }).then(yes => {
        expect(yes).to.be.true;
        return pStator.isNewerThan(gStator);
      }).then(yes => {
        expect(yes).to.be.true;
        return pStator.stat();
      }).then(stats => {
        pStats = stats;
        return test();
      }).then(() => {
        return del(parserFile);
      }).then(() => {
        return expectEventuallyDeleted(parserFile);
      }).then(yes => {
        expect(yes).to.be.true;
        return childProcessData(spawn('gulp', args));
      }).then(() => {
        return pStator.stat().then(stats => {
          expect(stats.mtime).not.to.eql(pStats.mtime);
          pStats = stats;
          return pStator.isNewerThan(gStator);
        }).then(yes => {
          expect(yes).to.be.true;
        });
      });
    });
  };

  it(`Testing newer(path)`, testArgument());
  it(`Testing newer({parserDir: path})`, testArgument('--object'));
  it(`Testing newer({parserDir: path, lexer: true})`, testArgument('--lexer'));
});
