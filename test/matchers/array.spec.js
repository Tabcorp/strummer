var array  = require('../../lib/matchers/array');
var string = require('../../lib/matchers/string');

describe('array matcher', function() {

  it('rejects anything that isnt an array', function() {
    var schema = array({of: string()});
    schema('path', 'bob').should.eql([{
      path: 'path',
      value: 'bob',
      message: 'should be an array'
    }]);
  });

  it('validates arrays of matchers', function() {
    var schema = array({of: string()});
    schema('path', ['bob', 3]).should.eql([{
      path: 'path[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('validates arrays of objects', function() {
    var schema = array({of: {
      name: 'string',
      age: 'number'
    }});
    schema('people', [
      { name: 'alice', age: 30    },
      { name: 'bob',   age: 'foo' }
    ]).should.eql([{
      path: 'people[1].age',
      value: 'foo',
      message: 'should be a number'
    }]);
  });

  it('can omit the <of> keyword', function() {
    var schema = array(string());
    schema('values', ['bob', 3]).should.eql([{
      path: 'values[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can specify the matcher name as a string', function() {
    var schema = array('string');
    schema('path', ['bob', 3]).should.eql([{
      path: 'path[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can specify the <of> matcher name as a string', function() {
    var schema = array({of: 'string'});
    schema('path', ['bob', 3]).should.eql([{
      path: 'path[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('validates min length of an array', function() {
    var schema = array({of: string(), min:2});
    schema('path', ['bob']).should.eql([{
      path: 'path',
      value: ['bob'],
      message: 'should have at least 2 items'
    }]);
  });

  it('validates max length of an array', function() {
    var schema = array({of: string(), max:2});
    schema('path', ['bob', 'the', 'builder']).should.eql([{
      path: 'path',
      value: ['bob', 'the', 'builder'],
      message: 'should have at most 2 items'
    }]);
  });

  it('rejects if min and max lengths options are violated', function() {
    var schema = array({of: string(), min:1, max:2});
    schema('path', ['bob', 'the', 'builder']).should.eql([{
      path: 'path',
      value: ['bob', 'the', 'builder'],
      message: 'should have length between 1 and 2'
    }]);
  });

});
