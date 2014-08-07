var integer = require('../../lib/matchers/integer');

describe('integer matcher', function() {

  it('matches integers', function() {
    integer()('', 0).should.not.have.error();
    integer()('', 3).should.not.have.error();
    integer()('', -1).should.not.have.error();
  });

  it('fails for other types', function() {
    integer()('', null).should.have.error(/should be an integer/);
    integer()('', 'foo').should.have.error(/should be an integer/);
    integer()('', true).should.have.error(/should be an integer/);
    integer()('', 3.5).should.have.error(/should be an integer/);
  });

  it('supports min and max', function() {
    integer({min: 3})('', 0).should.have.error(/should be an integer >= 3/);
    integer({max: 3})('', 5).should.have.error(/should be an integer <= 3/);
    integer({min: 3, max: 5})('', 7).should.have.error(/should be an integer between 3 and 5/);
  });

});
