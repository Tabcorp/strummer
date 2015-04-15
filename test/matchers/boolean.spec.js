var BoolMatcher = require('../../lib/matchers/boolean');

describe('boolean matcher', function() {

  it('matches boolean', function() {
    new BoolMatcher().match('', true).should.not.have.error();
    new BoolMatcher().match('', false).should.not.have.error();
  });

  it('fails for other types', function() {
    new BoolMatcher().match('', null).should.have.error(/should be a boolean/);
    new BoolMatcher().match('', 'foo').should.have.error(/should be a boolean/);
    new BoolMatcher().match('', 1).should.have.error(/should be a boolean/);
    new BoolMatcher().match('', 'true').should.have.error(/should be a boolean/);
  });

  it('can parse boolean from string', function() {
    new BoolMatcher({parse: true}).match('', true).should.not.have.error();
    new BoolMatcher({parse: true}).match('', false).should.not.have.error();
    new BoolMatcher({parse: true}).match('', 'true').should.not.have.error();
    new BoolMatcher({parse: true}).match('', 'false').should.not.have.error();
    new BoolMatcher({parse: true}).match('', 'TRUE').should.not.have.error();
    new BoolMatcher({parse: true}).match('', 'FALSE').should.not.have.error();
  });

  it('fails if cannot be parsed as a boolean', function() {
    new BoolMatcher({parse: true}).match('', 'hello').should.have.error(/should be a boolean/);
    new BoolMatcher({parse: true}).match('', 1).should.have.error(/should be a boolean/);
    new BoolMatcher({parse: true}).match('', {hello: 'world'}).should.have.error(/should be a boolean/);
    new BoolMatcher({parse: true}).match('', null).should.have.error(/should be a boolean/);
    new BoolMatcher({parse: true}).match('', undefined).should.have.error(/should be a boolean/);
  });

});
