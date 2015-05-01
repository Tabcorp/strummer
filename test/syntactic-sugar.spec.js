var s = require('../lib/strummer');

describe('syntactic sugar', function() {

  it('can use the matchers name instead of the function', function() {
    var schema = s('string');
    schema.match(3).should.eql([{
      path: '',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can use object litterals instead of the object matcher', function() {
    var schema = s({
      name: new s.string(),
      age: new s.number()
    });
    schema.match({
      name: 'bob',
      age: 'foo'
    }).should.eql([{
      path: 'age',
      value: 'foo',
      message: 'should be a number'
    }]);
  });

  it('can use matcher names inside object litterals', function() {
    var schema = s({
      name: 'string',
      age: 'number'
    });
    schema.match({
      name: 'bob',
      age: 'foo'
    }).should.eql([{
      path: 'age',
      value: 'foo',
      message: 'should be a number'
    }]);
  });

  it('can use the array litteral notation', function() {
    var schema = s({
      names: ['string']
    });
    schema.match({
      names: ['hello', 123]
    }).should.eql([{
      path: 'names[1]',
      value: 123,
      message: 'should be a string'
    }]);
  });

  it('can use the regex litteral notation', function() {
    var schema = s({
      name: /^[a-z]+$/
    });
    schema.match({
      name: 'Bob123'
    }).should.eql([{
      path: 'name',
      value: 'Bob123',
      message: 'should match the regex /^[a-z]+$/'
    }]);
  });

});
