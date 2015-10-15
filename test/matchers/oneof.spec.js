var oneOf = require('../../lib/matchers/oneOf');

describe('oneOf', function() {
  it('throws errors when passing a empty values', function() {
    (function() {
      oneOf();
    }.should.throw());

    (function() {
      oneOf(null);
    }.should.throw());

    (function() {
      oneOf(0);
    }.should.throw());

    (function() {
      oneOf('');
    }.should.throw());
  });

  it('throws when passing a empty array', function() {
    (function() {
      oneOf([]);
    }.should.throw());
  });

  it('matches any one of the schemas', function() {
    oneOf(['string', 'number']).match(1).should.not.have.error();
  });

  it('will have errors when not matching any of the schemas', function() {
    oneOf(['string', 'number']).match({}).should.have.error(/is not valid under any of the given schemas/);
  });

  it('generates oneOf json schema for mixed types', function() {
    oneOf(['string', 'number']).toJSONSchema().should.eql({
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    });
  });

  it('generates oneOf json schema for same types', function() {
    oneOf([{ foo: 'string' }, { bar: 'number' }]).toJSONSchema().should.eql({
      type: 'object',
      oneOf: [
        {
          type: 'object',
          properties: {
            foo: { type: 'string' }
          },
          required: ['foo']
        },
        {
          type: 'object',
          properties: {
            bar: { type: 'number' }
          },
          required: ['bar']
        }
      ]
    });
  });
});
