var regex = require('../../lib/matchers/regex');

describe('regex matcher', function() {

  it('must be passed a valid regex', function() {
    (function() {
      regex(123);
    }).should.throw('Invalid regex matcher');
  });

  it('matches a given regex', function() {
    regex(/[a-z]+/)('', 'hello').should.not.have.error();
    regex(/[0-9]{2}/)('', 'hello12world').should.not.have.error();
    regex(/^[a-z]+\d?$/)('', 'hello1').should.not.have.error();
  });

  it('fails if the regex does not match', function() {
    regex(/[a-z]+/)('', '123').should.have.error('should match the regex [a-z]+');
  });

  it('fails for non string types', function() {
    regex(/[a-z]+/)('', null).should.have.error(/should be a string/);
    regex(/[a-z]+/)('', 123).should.have.error(/should be a string/);
    regex(/[a-z]+/)('', true).should.have.error(/should be a string/);
  });

});
