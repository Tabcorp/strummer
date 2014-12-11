var string = require('../../lib/matchers/string');

describe('string matcher', function() {

  it('matches strings', function() {
    string()('', '').should.not.have.error();
    string()('', 'hello').should.not.have.error();
    string()('', 'h').should.not.have.error();
  });

  it('fails for other types', function() {
    string()('', null).should.have.error(/should be a string/);
    string()('', {hello: 'world'}).should.have.error(/should be a string/);
    string()('', true).should.have.error(/should be a string/);
    string()('', 3.5).should.have.error(/should be a string/);
  });

});
