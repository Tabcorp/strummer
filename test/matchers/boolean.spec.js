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
    boolean()('', 'true').should.have.error(/should be a boolean/);
  });

  it('can parse boolean from string', function() {
    boolean({parse: true})('', true).should.not.have.error();
    boolean({parse: true})('', false).should.not.have.error();
    boolean({parse: true})('', 'true').should.not.have.error();
    boolean({parse: true})('', 'false').should.not.have.error();
    boolean({parse: true})('', 'TRUE').should.not.have.error();
    boolean({parse: true})('', 'FALSE').should.not.have.error();
  });

  it('fails if cannot be parsed as a boolean', function() {
    boolean({parse: true})('', 'hello').should.have.error(/should be a boolean/);
    boolean({parse: true})('', 1).should.have.error(/should be a boolean/);
    boolean({parse: true})('', {hello: 'world'}).should.have.error(/should be a boolean/);
    boolean({parse: true})('', null).should.have.error(/should be a boolean/);
    boolean({parse: true})('', undefined).should.have.error(/should be a boolean/);
  });

});
