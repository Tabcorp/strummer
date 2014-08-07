var boolean = require('../../lib/matchers/boolean');

describe('boolean matcher', function() {

  it('matches boolean', function() {
    boolean()('', true).should.not.have.error();
    boolean()('', false).should.not.have.error();
  });

  it('fails for other types', function() {
    boolean()('', null).should.have.error(/should be a boolean/);
    boolean()('', 'foo').should.have.error(/should be a boolean/);
    boolean()('', 1).should.have.error(/should be a boolean/);
  });

});
