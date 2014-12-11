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

  it('supports min and max', function() {
    string({min: 3})('', "he").should.have.error(/should be a string with length >= 3/);
    string({max: 3})('', "hello").should.have.error(/should be a string with length <= 3/);
    string({min: 3, max: 5})('', "hello world").should.have.error(/should be a string with length between 3 and 5/);
    string({min: 3, max: 5})('', "hell").should.not.have.an.error();
  });

});
