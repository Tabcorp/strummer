var regex = require('../../lib/matchers/regex');

describe('regex matcher', function() {

  it('must be passed a valid regex', function() {
    (function() {
      new regex(123);
    }).should.throw('Invalid regex matcher');
  });

  it('matches a given regex', function() {
    new regex(/[a-z]+/).match('', 'hello').should.not.have.error();
    new regex(/[0-9]{2}/).match('', 'hello12world').should.not.have.error();
    new regex(/^[a-z]+\d?$/).match('', 'hello1').should.not.have.error();
  });

  it('fails if the regex does not match', function() {
    new regex(/[a-z]+/).match('', '123').should.have.error('should match the regex /[a-z]+/');
  });

  it('fails for non string types', function() {
    new regex(/[a-z]+/).match('', null).should.have.error(/should be a string/);
    new regex(/[a-z]+/).match('', 123).should.have.error(/should be a string/);
    new regex(/[a-z]+/).match('', true).should.have.error(/should be a string/);
  });

  it('generates string json schema with regex pattern', function() {
    new regex(/[a-z]+/)._toJSONSchema().should.eql({
      type: 'string',
      pattern: '[a-z]+'
    });
  });

  it('generates a json schema with description option', function() {
    new regex(/[a-z]+/, {description: 'Lorem ipsum'})._toJSONSchema().should.eql({
      type: 'string',
      pattern: '[a-z]+',
      description: 'Lorem ipsum'
    });
  });
});
