var should = require('should');
var s      = require('../lib/index');

// integrate with should.js
require('./strum.should');

describe('strum', function() {

  it('passes null values to the matchers', function() {
    var schema = s({
      name: s.string()
    });
    schema({
      name: null
    }).should.eql([
      {
        path: 'name',
        value: null,
        message: 'should be a string'
      }
    ]);
  });

  it('can specify a matcher is optional', function() {
    var schema = s({
      name: s.optional(s.string())
    });
    schema({
      name: null
    }).should.eql([]);
  });

  it('passes options to the matchers', function() {
    var schema = s({
      val: s.number({min: 10})
    });
    schema({
      val: 5
    }).should.eql([{
      path: 'val',
      value: 5,
      message: 'should be above 10'
    }]);
  });

  it('can define custom leaf matchers', function() {
    var greeting = s(function(val) {
      if (/hello [a-z]+/.test(val) === false) {
        return 'should be a greeting';
      }
    });
    var schema = s({
      hello: greeting
    });
    schema({
      hello: 'bye'
    }).should.eql([
      {
        path: 'hello',
        value: 'bye',
        message: 'should be a greeting'
      }
    ]);
  });

  it('matchers can return other matchers', function() {
    var schema = s({
      age: function(path, value) {
        return s.number();
      }
    });
    schema({
      age: 'foo'
    }).should.eql([
      {
        path: 'age',
        value: 'foo',
        message: 'should be a number'
      }
    ]);
  });

  it('can return dynamic matchers', function() {

    var schema = s({
      thing: function (path, value) {
        if (value.type === 'A') {
          return s({a: 'number'});
        } else {
          return s({b: 'number'});
        }
      }
    });

    schema({
      thing: {type: 'B', b: 'foo'}
    }).should.eql([
      {
        path: 'thing.b',
        value: 'foo',
        message: 'should be a number'
      }
    ]);

  });

  describe('syntactic sugar', function() {

    it('can use the matchers name instead of the function', function() {

      var schema = s({
        name: 'string',
        age:  'number'
      });

      schema({
        name: 'bob',
        age: 'foo'
      }).should.eql([
        {
          path: 'age',
          value: 'foo',
          message: 'should be a number'
        }
      ]);

    });

  });

  describe('should integration', function() {

    it('throws a nice legible error', function() {
      var person = {
        name: 'bob',
        age: 'foo'
      };
      (function() {
        person.should.have.structure({
          name: 'string',
          age: 'number'
        });
      }).should.throw(/should be a number/);
    });

  });

});
