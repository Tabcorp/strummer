var s       = require('../../lib/strummer');
var hashmap = require('../../lib/matchers/hashmap');
var Matcher = require('../../lib/matcher');

describe('hashmap matcher', function() {

  var OBJ = {one: 1, two: 2};

  it('should be an object', function() {
    new hashmap().match('x', true).should.have.error('should be a hashmap');
  });

  describe('key and value types', function() {

    it('matches keys', function() {
      new hashmap({
        keys: new s.string()
      }).match('x', OBJ).should.not.have.error();
      new hashmap({keys: new s.regex(/n/)}).match('x', OBJ).should.eql([
        {path: 'x.keys[1]', value: 'two', message: 'should match the regex /n/'}
      ]);
    });

    it('matches values', function() {
      new hashmap({values: new s.number()}).match('x', OBJ).should.not.have.error();
      new hashmap({values: new s.number({max: 1})}).match('x', OBJ).should.eql([
        {path: 'x[two]', value: 2, message: 'should be a number <= 1'}
      ]);
    });

    it('matches both keys and value types', function() {
      new hashmap({
        keys: /n/,
        values: new s.number({max: 1})
      }).match('x', OBJ).should.eql([
        {path: 'x.keys[1]', value: 'two', message: 'should match the regex /n/'},
        {path: 'x[two]', value: 2, message: 'should be a number <= 1'}
      ]);
    });


  });

  describe('syntactic sugar', function() {

    it('accepts primitive keys and value types', function() {
      new hashmap({
        keys: /n/,
        values: 'boolean'
      }).match('x', OBJ).should.eql([
        {path: 'x.keys[1]', value: 'two', message: 'should match the regex /n/'},
        {path: 'x[one]', value: 1, mesage: 'should be a boolean'},
        {path: 'x[two]', value: 2, message: 'should be a boolean'}
      ]);
    });

    it('can specify just the value type', function() {
      new hashmap(new s.number()).match('x', OBJ).should.not.have.error();
      new hashmap(new s.boolean()).match('x', OBJ).should.eql([
        {path: 'x[one]', value: 1, message: 'should be a boolean'},
        {path: 'x[two]', value: 2, message: 'should be a boolean'}
      ]);
    });

    it('can specify just the value type as a string', function() {
      new hashmap('number').match('x', OBJ).should.not.have.error();
      new hashmap('boolean').match('x', OBJ).should.eql([
        {path: 'x[one]', value: 1, message: 'should be a boolean'},
        {path: 'x[two]', value: 2, message: 'should be a boolean'}
      ]);
    });

    it('handles falsy return values from value matchers', function() {
      var valueMatcher = {
        match: function() {},
        __proto__: new Matcher({})
      };
      new hashmap({
        values: valueMatcher
      }).match('x', {
        foo: 'bar'
      }).should.eql([]);
    });

  });

});
