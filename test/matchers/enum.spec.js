var enumer = require('../../lib/matchers/enum');

describe('enum matcher', function() {

  var valid = ['blue', 'red', 'green'];

  it('fails to create the match if the arguments are invalid', function() {
    (function() {
      enumer({values: null});
    }).should.throw('Invalid enum values: null');
    (function() {
      enumer({values: 'blue'});
    }).should.throw('Invalid enum values: blue');
  });

  it('matches from a list of values', function() {
    enumer({values: valid})('', 'blue').should.not.have.error();
    enumer({values: valid})('', 'red').should.not.have.error();
    enumer({values: valid})('', 'green').should.not.have.error();
    enumer({values: valid})('', 'yellow').should.have.error(/should be a valid enum value/);
  });

  it('can give the enum a name for better errors', function() {
    m = enumer({
      values: valid,
      name: 'color'
    });
    m('', 'yellow').should.have.error(/should be a valid color/);
  });

  it('can return the full list of allowed values', function() {
    m = enumer({
      values: valid,
      verbose: true
    });
    m('', 'yellow').should.have.error(/should be a valid enum value \(blue,red,green\)/);
  });

  it('can combined both name and verbose', function() {
    m = enumer({
      values: valid,
      name: 'color',
      verbose: true
    });
    m('', 'yellow').should.have.error(/should be a valid color \(blue,red,green\)/);
  });

});
