var s       = require('../../lib/s');
var hashmap = require('../../lib/matchers/hashmap');

describe('hashmap matcher', function() {

  var OBJ = {one: 1, two: 2};

  it('should be an object', function() {
    hashmap()('x', true).should.have.error('should be a hashmap');
  });

  describe('key and value types', function() {

    it('matches keys', function() {
      hashmap({keys: s.string()})('x', OBJ).should.not.have.error();
      hashmap({keys: s.regex(/n/)})('x', OBJ).should.eql([
        {path: 'x.keys[1]', value: 'two', message: 'should match the regex /n/'},
      ])
    });

    it('matches values', function() {
      hashmap({values: s.number()})('x', OBJ).should.not.have.error();
      hashmap({values: s.number({max: 1})})('x', OBJ).should.eql([
        {path: 'x[two]', value: 2, message: 'should be a number <= 1'}
      ]);
    });

    it('matches both keys and value types', function() {
      hashmap({
        keys: /n/,
        values: s.number({max: 1})
      })('x', OBJ).should.eql([
        {path: 'x.keys[1]', value: 'two', message: 'should match the regex /n/'},
        {path: 'x[two]', value: 2, message: 'should be a number <= 1'}
      ]);
    });


  });

  describe('syntactic sugar', function() {

    it('accepts primitive keys and value types', function() {
      hashmap({
        keys: /n/,
        values: 'boolean'
      })('x', OBJ).should.eql([
        {path: 'x.keys[1]', value: 'two', message: 'should match the regex /n/'},
        {path: 'x[one]', value: 1, message: 'should be a boolean'},
        {path: 'x[two]', value: 2, message: 'should be a boolean'}
      ]);
    });

    it('can specify just the value type', function() {
      hashmap(s.number())('x', OBJ).should.not.have.error();
      hashmap(s.boolean())('x', OBJ).should.eql([
        {path: 'x[one]', value: 1, message: 'should be a boolean'},
        {path: 'x[two]', value: 2, message: 'should be a boolean'}
      ]);
    });

    it('can specify just the value type as a string', function() {
      hashmap('number')('x', OBJ).should.not.have.error();
      hashmap('boolean')('x', OBJ).should.eql([
        {path: 'x[one]', value: 1, message: 'should be a boolean'},
        {path: 'x[two]', value: 2, message: 'should be a boolean'}
      ]);
    });

    it('handles falsy return values from value matchers', function() {
      var valueMatcher = function(path, value) {};
      hashmap({
        values: valueMatcher
      })('x', {
        foo: 'bar',
      }).should.eql([])
    });

  });

});
