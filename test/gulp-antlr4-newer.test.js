import Muter, {captured} from 'muter';
import {expect} from 'chai';
import GulpAntlr4Newer from '../src/gulp-antlr4-newer';

describe('Testing GulpAntlr4Newer', function () {
  const muter = Muter(console, 'log'); // eslint-disable-line new-cap

  it(`Class GulpAntlr4Newer says 'Hello world!'`, captured(muter, function () {
    new GulpAntlr4Newer();
    expect(muter.getLogs()).to.equal('Hello world!\n');
  }));
});
