var s = require('../lib/strummer');

describe('strummer', function() {
  it('throws error when passing a empty definition', function() {
    (function() {
      s();
    }).should.throw();
  });

  it('passes null values to the matchers', function() {
    var schema = s({
      name: new s.string()
    });
    schema.match({
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
      name: new s.string()
    });
    schema.match('path', null).should.eql([
      {
        path: 'path',
        value: null,
        message: 'should be an object'
      }
    ]);
  });

  it('can handle an undefined obj', function() {
    var schema = s({
      name: new s.string()
    });
    schema.match('path', undefined).should.eql([
      {
        path: 'path',
        value: undefined,
        message: 'should be an object'
      }
    ]);
  });

  it('can handle null values', function() {
    var schema = s({
      name: new s.string()
    });
    schema.match('', {name: null}).should.eql([
      {
        path: 'name',
        value: null,
        message: 'should be a string'
      }
    ]);
  });

  it('can handle undefined values', function() {
    var schema = s({
      name: new s.string()
    });
    schema.match('', {name: undefined}).should.eql([
      {
        path: 'name',
        value: undefined,
        message: 'should be a string'
      }
    ]);
  });

  it('can specify a matcher is optional', function() {
    var schema = s({
      name: new s.optional(new s.string())
    });
    schema.match({
      name: null
    }).should.eql([]);
  });

  it('passes options to the matchers', function() {
    var schema = s({
      val: new s.number({min: 10})
    });
    schema.match({
      val: 5
    }).should.eql([{
      path: 'val',
      value: 5,
      message: 'should be a number >= 10'
    }]);
  });

  it('can define custom leaf matchers', function() {
    var greeting = s.createMatcher({
      initialize: function() {},
      match: function(path, val) {
        if (/hello [a-z]+/.test(val) === false) {
          return 'should be a greeting';
        }
      }
    });

    var schema = s({
      hello: new greeting()
    });
    schema.match({
      hello: 'bye'
    }).should.eql([
      {
        path: 'hello',
        value: 'bye',
        message: 'should be a greeting'
      }
    ]);
  });

  it('can assert on a matcher being successful', function() {
    var person = {
      name: 3,
      age: 'bob'
    };
    (function() {
      s.assert(person, {
        name: 'string',
        age: 'number'
      });
    }).should.throw(/name should be a string \(was 3\)/)
             .throw(/age should be a number \(was 'bob'\)/);
  });

  it('should stringify values when assertions fail', function() {
    var person = {
      name: { text: 'bob' }
    };
    (function() {
      s.assert(person, {
        name: 'string'
      });
    }).should.throw(/name should be a string \(was { text: 'bob' }\)/);
  });

  it('throws error when match is not implemented', function() {
    (function() {
      s.createMatcher({});
    }).should.throw(/match is not implemented/);
  });

  it('supports optional initialize method', function() {
    (function() {
      var m = s.createMatcher({
        match: function() {
          return;
       }
      });
      var schema = m();
      schema.match();
    }).should.not.throw();
  });

  it('supports initialize with name', function() {
    var m = s('User', {
      foo: 'string',
      bar: 'number'
    });

    var data = {
      foo: 123,
      bar: 'str'
    };

    m.name.should.equal('User');
    m.match(data).should.have.lengthOf(2);
  });
});
