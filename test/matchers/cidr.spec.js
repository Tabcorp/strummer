var CIDRMatcher  = require('../../lib/matchers/cidr');

describe('ip address matcher', function() {
  it('matches ip address', function() {
    new CIDRMatcher({version: 4}).match('', '0.0.0.0/32').should.not.have.error();
    new CIDRMatcher({version: 4}).match('', '255.255.255.255/6').should.not.have.error();
    new CIDRMatcher({version: 4}).match('', '127.0.0.1/12').should.not.have.error();
    new CIDRMatcher({version: 4}).match('', '192.168.0.1/8').should.not.have.error();
  });

  it('should fail with incorrect format', function() {
    new CIDRMatcher({version: 4}).match('', '192.168.0.1').should.have.error('should be a valid IPv4 cidr');
    new CIDRMatcher({version: 4}).match('', '192.168.0.1/128').should.have.error('should be a valid IPv4 cidr');
    new CIDRMatcher({version: 4}).match('', '192.168.0.1/33').should.have.error('should be a valid IPv4 cidr');
    new CIDRMatcher({version: 4}).match('', '192.168.0.1/12.8').should.have.error('should be a valid IPv4 cidr');
    new CIDRMatcher({version: 4}).match('', '192.168.0.1/ab').should.have.error('should be a valid IPv4 cidr');
  });

  it('should fail with invalid ip', function() {
    new CIDRMatcher({version: 4}).match('', '256.0.0.0').should.have.error('should be a valid IPv4 cidr');
    new CIDRMatcher({version: 4}).match('', '0.0.0.00').should.have.error('should be a valid IPv4 cidr');
  });

  it('should fail without correct version argument', function() {
    (function() {
      new CIDRMatcher();
    }).should.throw('Must be initialized with version 4');
    (function() {
      new CIDRMatcher({version: 6});
    }).should.throw('Must be initialized with version 4');
  })

  it('returns pattern as json schema', function() {
    new CIDRMatcher({version: 4}).toJSONSchema().should.eql({
      type: 'string',
      pattern: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\/([0-9]|[1-2][0-9]|3[0-2])$'
    });
  });
});
