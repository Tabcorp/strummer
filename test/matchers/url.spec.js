var url = require('../../lib/matchers/url');

describe('url matcher', function() {

  it('has to be a string', function() {
    new url().match('', 123).should.have.error(/should be a URL/);
    new url().match('', false).should.have.error(/should be a URL/);
  });

  it('matches urls', function() {
    new url().match('', 'http://www.google.com').should.not.have.error()
    new url().match('', 'https://www.google.com').should.not.have.error()
    new url().match('', 'http://localhost:1234').should.not.have.error()
    new url().match('', 'http://www.google.com/path/hello%20world?query+string').should.not.have.error()
    new url().match('', 'http://user:pass@server').should.not.have.error()
    new url().match('', 'postgres://host/database').should.not.have.error()
  });

  it('fails for non urls', function() {
    new url().match('', 'almost/a/url').should.have.error(/should be a URL/);
    new url().match('', 'http://').should.have.error(/should be a URL/);
    new url().match('', 'redis://localhost').should.have.error(/should be a URL/);
  });

  it('generates a url format string json schema', function() {
    new url().toJSONSchema().should.eql({
      type: 'string',
      format: 'url'
    });
  });

  it('generates a json schema with description option', function() {
    new url({ description: 'Lorem ipsum' }).toJSONSchema().should.eql({
      type: 'string',
      format: 'url',
      description: 'Lorem ipsum'
    });
  });
});
