require('../../lib/strummer');
var array  = require('../../lib/matchers/array');
var bool  = require('../../lib/matchers/boolean');
var optional = require('../../lib/matchers/optional');
var string = require('../../lib/matchers/string');
var Matcher = require('../../lib/matcher');

describe('array matcher', function() {

  it('rejects anything that isnt an array', function() {
    var schema = new array({of: new string()});
    schema.match('path', 'bob').should.eql([{
      path: 'path',
      value: 'bob',
      message: 'should be an array'
    }]);
  });

  it('validates arrays of matchers', function() {
    var schema = new array({of: new string()});
    schema.match('path', ['bob', 3]).should.eql([{
      path: 'path[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('validates arrays of objects', function() {
    var schema = new array({of: {
      name: 'string',
      age: 'number'
    }});
    schema.match('people', [
      { name: 'alice', age: 30    },
      { name: 'bob',   age: 'foo' }
    ]).should.eql([{
      path: 'people[1].age',
      value: 'foo',
      message: 'should be a number'
    }]);
  });

  it('can omit the <of> keyword', function() {
    var schema = new array(new string());
    schema.match('values', ['bob', 3]).should.eql([{
      path: 'values[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can specify the matcher name as a string', function() {
    var schema = new array('string');
    schema.match('path', ['bob', 3]).should.eql([{
      path: 'path[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can specify the <of> matcher name as a string', function() {
    var schema = new array({of: 'string'});
    schema.match('path', ['bob', 3]).should.eql([{
      path: 'path[1]',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('validates min length of an array', function() {
    var schema = new array({of: new string(), min: 2});
    schema.match('path', ['bob']).should.eql([{
      path: 'path',
      value: ['bob'],
      message: 'should have at least 2 items'
    }]);
  });

  it('validates max length of an array', function() {
    var schema = new array({of: new string(), max: 2});
    schema.match('path', ['bob', 'the', 'builder']).should.eql([{
      path: 'path',
      value: ['bob', 'the', 'builder'],
      message: 'should have at most 2 items'
    }]);
  });

  it('rejects if min and max lengths options are violated', function() {
    var schema = new array({of: new string(), min: 1, max: 2});
    schema.match('path', ['bob', 'the', 'builder']).should.eql([{
      path: 'path',
      value: ['bob', 'the', 'builder'],
      message: 'should have between 1 and 2 items'
    }]);
  });

  it('cannot be called with a litteral object matcher inside', function() {
    // because this would make of/min/max special keywords
    // and we wouldn't support arrays of objects with these properties
    (function() {
      new array({name: 'string'});
    }).should.throw(/Invalid array matcher/);
  });

  it('handles falsy return values from value matchers', function() {
    var valueMatcher = {
      __proto__: new Matcher({}),
      match: function() {}
    };

    new array({
      of: valueMatcher
    }).match('path', ['bob', 'the', 'builder']).should.eql([]);
  });

  it('creates a simple array json schema', function() {
    new array({ of: 'string' }).toJSONSchema().should.eql({
      type: 'array',
      items: {
        type: 'string'
      }
    });
  });

  it('creates a simple array json schema with optional description', function() {
    new array({ of: 'string', description: 'Lorem ipsum' }).toJSONSchema().should.eql({
      type: 'array',
      description: 'Lorem ipsum',
      items: {
        type: 'string'
      }
    });
  });

  it('creates array json schema with minItems option', function() {
    new array({ of: 'string', min: 1 }).toJSONSchema().should.eql({
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1
    });
  });

  it('creates array json schema with maxItems option', function() {
    new array({ of: 'string', min: 1, max: 999 }).toJSONSchema().should.eql({
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1,
      maxItems: 999
    });
  });

  it('passes index of item to the matcher', function() {
    var valueMatcher = {
      __proto__: new Matcher({}),
      match: function(path, value, index) {
        return [{ path: path, value: value, message: value + ' is number ' + (index + 1)}]
      }
    };

    new array({
      of: valueMatcher
    }).match('path', ['bob']).should.eql([{
      path: 'path[0]',
      value: 'bob',
      message: 'bob is number 1'
    }]);
  });

  it('parses an array', function() {
    new array({ of: new bool() }).safeParse('', ['true']).should.eql({ value: [true], errors: [] });

    new array({ of: new bool() }).safeParse('', ['hello']).should.eql({
      errors: [{ path: '[0]', message: 'should be a boolean' }]
    });

    new array({ of: new bool() }).safeParse('', ['hello', false]).should.eql({
      errors: [{ path: '[0]', message: 'should be a boolean' }]
    });
  });

  it('parses invalid nested arrays', function() {
    new array({ of: new array({ of: bool() }) }).safeParse('', ['hello', 'false']).should.eql({
      errors: [
        { path: '[0]', message: 'should be an array', value: 'hello' },
        { path: '[1]', message: 'should be an array', value: 'false' }
      ]
    });
  });

  it('parses valid nested arrays', function() {
    new array({ of: new array({ of: bool() }) }).safeParse('', [['true']]).should.eql({ value: [[true]], errors: [] });
  });

  it('parses an array of optionals', function() {
    new array({ of: optional(bool()) }).safeParse('', ['true', undefined, 'false']).should.eql({
      value: [true, undefined, false], errors: []
    });
  });
});
