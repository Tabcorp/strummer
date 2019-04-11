var _     = require('lodash')
var email = require('../../lib/matchers/email');

describe('email matcher', function() {

  it('matches email', function() {
    email().match('path', 'foo@bar.com').should.not.have.error()
    email().match('path', 'FoO@bar.com.au').should.not.have.error()
  });

  it('fails for other types', function() {
    var schema = email()
    schema.match('path', null).should.have.error('should be a valid email address');
    schema.match('path', 50).should.have.error('should be a valid email address');
    schema.match('path', 'a long time').should.have.error('should be a valid email address');
  });

  it('can specify a domain', function() {
    var schema = email({domain: 'bar.com'})
    schema.match('path', 'foo@bar.com').should.not.have.error();
    schema.match('path', 'foo@baz.com').should.have.error('should be a valid email address at bar.com');
  });

  it('only accepts valid domains', function() {
    (function() {
      email({domain: 'aue$aue.com'});
    }).should.throw('Invalid domain value: aue$aue.com');
  });

  it('only accepts valid sized email ids', function() {
    invalidEmailId = randomString(65) + '@something.com';
    email().match('', invalidEmailId).should.have.error('should be a valid email address');
  })

  it('only accepts valid sized domain parts', function() {
    invalidEmailId = 'foo@' + randomString(64) + '.com.au';
    email().match('', invalidEmailId).should.have.error('should be a valid email address');
  })

  it('only accepts valid sized email addresses', function() {
    invalidEmailId = randomString(64) + '@' + randomString(63) + '.' + randomString(63) + '.' + randomString(58) + '.com';
    email().match('', invalidEmailId).should.have.error('should be a valid email address');
  })

  it('generates a string schema with pattern', function() {
    var d = new email().toJSONSchema();
    var reg = new RegExp(d.pattern, 'i');
    d.type.should.equal('string');
    reg.test('foo@bar.com').should.eql(true);
    reg.test('FoO.bAr1@baz.com').should.eql(true);
  });

  it('generates a string schema optional description', function() {
    var d = new email({ description: 'Lorem ipsum' }).toJSONSchema();
    d.type.should.equal('string');
    d.description.should.equal('Lorem ipsum');
  });
});

var randomString = function(length) {
  return _.fill(Array(length), 'a').join('')
}
