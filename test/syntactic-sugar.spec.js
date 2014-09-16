var s = require('../lib/index');

describe('syntactic sugar', function() {

  it('can use the matchers name instead of the function', function() {
    var schema = s('string');
    schema(3).should.eql([{
      path: '',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can use object litterals instead of the object matcher', function() {
    var schema = s({
      name: s.string(),
      age:  s.number()
    });
    schema({
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
      age:  'number'
    });
    schema({
      name: 'bob',
      age: 'foo'
    }).should.eql([{
      path: 'age',
      value: 'foo',
      message: 'should be a number'
    }]);
  });

  it('can use custom functions directly', function() {
    var schema = s({
      number:  function(value) {
        if (value % 2) return 'should be an even number';
      }
    });
    schema({
      number: 3,
    }).should.eql([{
      path: 'number',
      value: 3,
      message: 'should be an even number'
    }]);
  });

  it('can use the array litteral notation', function() {
    var schema = s({
      names: ['string']
    });
    schema({
      names: ['hello', 123],
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
    schema({
      name: 'Bob123',
    }).should.eql([{
      path: 'name',
      value: 'Bob123',
      message: 'should match the regex ^[a-z]+$'
    }]);
  });

});
