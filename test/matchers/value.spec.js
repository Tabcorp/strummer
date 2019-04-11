var ValueMatcher = require('../../lib/matchers/value');

describe('equals matcher', function() {

  it('raises an exception when expectedValue is undefined', function() {
    (function() {
      new ValueMatcher();
    }).should.throw('must provide a primitive value to match');
  });

  it('raises an exception when expectedValue is an object', function() {
    (function() {
      new ValueMatcher({});
    }).should.throw('must provide a primitive value to match');
  });

  it('raises an exception when expectedValue is an array', function() {
    (function() {
      new ValueMatcher([]);
    }).should.throw('must provide a primitive value to match');
  });

  it('raises an exception when expectedValue is a function', function() {
    (function() {
      new ValueMatcher(function(){});
    }).should.throw('must provide a primitive value to match');
  });

  it('fails for non strict equality', function() {
    new ValueMatcher(true).match('', 'true').should.have.error(/should strict equal true/);
  });

  describe('when strict equality on primitive', function() {
    it('passes for boolean', function() {
      new ValueMatcher(true).match('', true).should.not.have.error();
    });

    it('passes for int', function() {
      new ValueMatcher(1).match('', 1).should.not.have.error();
    });

    it('passes for string', function() {
      new ValueMatcher('true').match('', 'true').should.not.have.error();
    });
  });

  it('generates enum json schema', function() {
    new ValueMatcher(1).toJSONSchema().should.eql({
      enum: [1]
    });
  });

  it('generates enum json schema with description', function() {
    new ValueMatcher(1, {description: 'Lorem ipsum'}).toJSONSchema().should.eql({
      enum: [1],
      description: 'Lorem ipsum'
    });
  });
});
