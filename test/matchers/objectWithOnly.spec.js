var objectWithOnly  = require('../../lib/matchers/objectWithOnly');
var array           = require('../../lib/matchers/array');
var boolean         = require('../../lib/matchers/boolean');
var string          = require('../../lib/matchers/string');
var number          = require('../../lib/matchers/number');
var optional        = require('../../lib/matchers/optional');
var Matcher         = require('../../lib/matcher');

describe('objectWithOnly object matcher', function() {

  it('cannot be called with anything but an object matcher', function() {
    (function() {
      new objectWithOnly('string');
    }).should.throw(/Invalid spec/);
  });

  it('constraints must be a function', function() {
    (function() {
      new objectWithOnly({}, { constraints: 'asdf' });
    }).should.throw(/Invalid constraints/);
  });

  it('returns error if the object matcher returns one', function() {
    var schema = new objectWithOnly({
      name: new string(),
      age:  new number()
    });

    schema.match('', 'bob').should.eql([{
      path: '',
      value: 'bob',
      message: 'should be an object'
    }]);
  });

  it('matches objects', function() {
    var schema = new objectWithOnly({
      name: new string(),
      age:  new number()
    });

    schema.match('', {name: 'bob', age: 21}).should.not.have.error();
  });

  it('allows missing keys if they are optional', function() {
    var schema = new objectWithOnly({
      name: new optional('string'),
      age:  new number()
    });

    schema.match('', {age: 21}).should.not.have.error();
  });

  it('rejects if there are extra keys', function() {
    var schema = new objectWithOnly({
      name: new string(),
      age:  new number()
    });

    schema.match('', {name: 'bob', age: 21, email: 'bob@email.com'}).should.eql([{
      path: 'email',
      value: 'bob@email.com',
      message: 'should not exist'
    }])
  });

  it('should not validate nested objects', function() {
    var schema = new objectWithOnly({
      name: new string(),
      age:  new number(),
      address: {
        email: new string()
      }
    });

    var bob = {
      name: 'bob',
      age: 21,
      address: {
        email: 'bob@email.com',
        home: '21 bob street'
      }
    }

    schema.match('', bob).should.not.have.error()
  });

  it('can be used within nested objects and arrays', function() {
    var schema = new objectWithOnly({
      name: 'string',
      firstBorn: new objectWithOnly({
        name: 'string',
        age: 'number'
      }),
      address: new array({of: new objectWithOnly({
        city: 'string',
        postcode: 'number'
      })})
    })

    var bob = {
      name: 'bob',
      firstBorn: {
        name: 'jane',
        age: 3,
        email: 'jane@bobismydad.com'
      },
      address: [{
        city: 'gosford',
        postcode: 2250,
        street: 'watt st'
      }]
    }
    schema.match('', bob).should.eql([{
      path: 'firstBorn.email',
      value: 'jane@bobismydad.com',
      message: 'should not exist'
    },{
      path: 'address[0].street',
      value: 'watt st',
      message: 'should not exist'
    }])
  })

  it('handles falsy return values from value matchers', function() {
    var valueMatcher = {
      __proto__: new Matcher({}),
      match: function() {}
    };

    new objectWithOnly({
      name: valueMatcher
    }).match('', {
      name: 'bob'
    }).should.eql([])
  });

  it('will parse a valid flat object', function() {
    var matcher = new objectWithOnly({ foo: boolean() });
    matcher.safeParse({ foo: 'true' }).should.eql({ errors: [], value: { foo: true }})
  });

  it('will parse an invalid flat object', function() {
    var matcher = new objectWithOnly({ foo: boolean() });
    matcher.safeParse({ foo: 'bar' }).should.eql({errors: [{path: 'foo', message: 'should be a boolean'}]})
  });

  it('will parse an valid nested object', function() {
    var matcher = new objectWithOnly({ foo: objectWithOnly({ bar: boolean() }) });
    matcher.safeParse({ foo: { bar: 'false' } }).should.eql({ errors: [], value: { foo: { bar: false } }})
  });

  it('will parse an invalid nested object', function() {
    var matcher = new objectWithOnly({ foo: objectWithOnly({ bar: boolean() }) });
    matcher.safeParse({ foo: 'true' }).should.eql({errors: [{ message: 'should be an object', path: 'foo', value: 'true'}]})
  });

  it('rejects if there are extra keys', function() {
    var schema = new objectWithOnly({
      name: new string(),
      age:  new number()
    });

    schema.safeParse('', {name: 'bob', age: 21, email: 'bob@email.com'}).should.eql({ errors: [{
      path: 'email',
      value: 'bob@email.com',
      message: 'should not exist'
    }]})
  });

  it('generates the object json schema but with additionalProperties which sets false', function() {
    new objectWithOnly({
      foo: 'string'
    }).toJSONSchema().should.eql({
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      },
      required: ['foo'],
      additionalProperties: false
    });
  });

  it('generates the object json schema with description option', function() {
    new objectWithOnly(
      { foo: 'string' },
      { description: 'Lorem ipsum' }
    ).toJSONSchema().should.eql({
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      },
      description: 'Lorem ipsum',
      required: ['foo'],
      additionalProperties: false
    });
  })

  it('calls constraint function and returns errors', function() {
    var constraintFunc = function (path, value) {
      if (value.street_number && !value.post_code) {
        return [{
          path: path,
          value: value,
          error: 'post_code is requried with a street_number'
        }]
      }

      return []
    }

    var schema = new objectWithOnly({
      email_address: new string(),
      street_number: new number({optional: true}),
      post_code: new number({optional: true}),
    }, {
      constraints: constraintFunc
    });

    var value = {
      email_address: 'test@strummer.com',
      street_number: 12,
    }

    schema.match(value).should.eql([{
      path: '',
      value: value,
      error: 'post_code is requried with a street_number'
    }]);
  });

  it('returns empty array if no constraint errors', function() {
    var constraintFunc = function (path, val) {
      return []
    }

    var schema = new objectWithOnly({
      name: new string(),
    }, {
      constraints: constraintFunc
    });

    schema.match('/', {name: 'works'}, constraintFunc).should.eql([]);
  });

});
