var IPMatcher  = require('../../lib/matchers/ip');

describe('ip address matcher', function() {
  it('matches ip address', function() {
    new IPMatcher({version: 4}).match('', '0.0.0.0').should.not.have.error();
    new IPMatcher({version: 4}).match('', '255.255.255.255').should.not.have.error();
    new IPMatcher({version: 4}).match('', '127.0.0.1').should.not.have.error();
    new IPMatcher({version: 4}).match('', '192.168.0.1').should.not.have.error();
  });

  it('should fail with incorrect format', function() {
    new IPMatcher({version: 4}).match('', '2607:f0d0:1002:51::4').should.have.error('should be a valid IPv4 address');
    new IPMatcher({version: 4}).match('', '0.0.0.0.0').should.have.error('should be a valid IPv4 address');
    new IPMatcher({version: 4}).match('', '0.0.0').should.have.error('should be a valid IPv4 address');
  });

  it('should fail with invalid ip', function() {
    new IPMatcher({version: 4}).match('', '256.0.0.0').should.have.error('should be a valid IPv4 address');
    new IPMatcher({version: 4}).match('', '0.0.0.00').should.have.error('should be a valid IPv4 address');
  });

  it('should fail without correct version argument', function() {
    (function() {
      new IPMatcher();
    }).should.throw('Must be initialized with version 4');
    (function() {
      new IPMatcher({version: 6});
    }).should.throw('Must be initialized with version 4');
  })

  it('returns pattern as json schema', function() {
    new IPMatcher({version: 4}).toJSONSchema().should.eql({
      type: 'string',
      pattern: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
    });
  });
});
