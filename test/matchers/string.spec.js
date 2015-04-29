var string = require('../../lib/matchers/string');

describe('string matcher', function() {

  it('matches strings', function() {
    new string().match('', '').should.not.have.error();
    new string().match('', 'hello').should.not.have.error();
    new string().match('', 'h').should.not.have.error();
  });

  it('fails for other types', function() {
    new string().match('', null).should.have.error(/should be a string/);
    new string().match('', {hello: 'world'}).should.have.error(/should be a string/);
    new string().match('', true).should.have.error(/should be a string/);
    new string().match('', 3.5).should.have.error(/should be a string/);
  });

  it('supports min and max', function() {
    new string({min: 3}).match('', "he").should.have.error(/should be a string with length >= 3/);
    new string({max: 3}).match('', "hello").should.have.error(/should be a string with length <= 3/);
    new string({min: 3, max: 5}).match('', "hello world").should.have.error(/should be a string with length between 3 and 5/);
    new string({min: 3, max: 5}).match('', "hell").should.not.have.an.error();
  });

});
