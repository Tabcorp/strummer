var url = require('../../lib/matchers/url');

describe('url matcher', function() {

  it('has to be a string', function() {
    url()('', 123).should.have.error(/should be a URL/);
    url()('', false).should.have.error(/should be a URL/);
  });

  it('matches urls', function() {
    url()('', 'http://www.google.com').should.not.have.error()
    url()('', 'http://localhost:1234').should.not.have.error()
    url()('', 'http://www.google.com/path/hello%20world?query+string').should.not.have.error()
    url()('', 'http://user:pass@server').should.not.have.error()
    url()('', 'postgres://host/database').should.not.have.error()
  });

  it('fails for non urls', function() {
    url()('', 'almost/a/url').should.have.error(/should be a URL/);
    url()('', 'http://').should.have.error(/should be a URL/);
    url()('', 'redis://localhost').should.have.error(/should be a URL/);
  })

});
