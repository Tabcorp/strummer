var s = require('../../lib/strummer');
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

  it('can match either of two object schemas', function() {
    var schema = s.oneOf([
      { foo: 'string' },
      { bar: 'string' }
    ])
    schema.match({foo: 'hello'}).should.not.have.error();
    schema.match({bar: 'world'}).should.not.have.error();
    schema.match({not: 'good'}).should.have.error(/is not valid under any of the given schemas/);
  })

  it('can be used inside an array matcher', function() {
    var schema = s.array({of: s.oneOf([
      { type: s.value('car'),  make: s.enum({values: ['Ford', 'Mazda']}) },
      { type: s.value('bike'), make: s.enum({values: ['Honda', 'Yamaha']}) }
    ])})
    // every array item is valid
    schema.match([
      { type: 'car', make: 'Ford' },
      { type: 'bike', make: 'Honda' }
    ]).should.not.have.error();
    // one item doesn't match particular properties
    schema.match([
      { type: 'car', make: 'Ford' },
      { type: 'bike', make: 'Ford' }
    ]).should.have.error(/bike/);
    // one item doesn't match any properties
    schema.match([
      { type: 'car', make: 'Ford' },
      { type: 'boat', make: 'Fairline' }
    ]).should.have.error(/boat/);
  })

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
