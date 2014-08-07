var s = require('../lib/index');

describe('strummer', function() {

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

  it('can handle a null obj', function() {
    var schema = s({
      name: s.string()
    });
    schema('path', null).should.eql([
      {
        path: 'path',
        value: null,
        message: 'should be an object'
      }
    ]);
  });

  it('can handle an undefined obj', function() {
    var schema = s({
      name: s.string()
    });
    schema('path', undefined).should.eql([
      {
        path: 'path',
        value: undefined,
        message: 'should be an object'
      }
    ]);
  });

  it('can handle null values', function() {
    var schema = s({
      name: s.string()
    });
    schema('', {name: null}).should.eql([
      {
        path: 'name',
        value: null,
        message: 'should be a string'
      }
    ]);
  });

  it('can handle undefined values', function() {
    var schema = s({
      name: s.string()
    });
    schema('', {name: undefined}).should.eql([
      {
        path: 'name',
        value: undefined,
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
      message: 'should be a number >= 10'
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

});
