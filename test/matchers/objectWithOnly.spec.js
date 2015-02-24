var objectWithOnly  = require('../../lib/matchers/objectWithOnly');
var array           = require('../../lib/matchers/array');
var string          = require('../../lib/matchers/string');
var number          = require('../../lib/matchers/number');
var s               = require('../../lib/s');

describe('objectWithOnly object matcher', function() {

  it('cannot be called with anything but an object matcher', function() {
    (function() {
      var schema = objectWithOnly('string');
    }).should.throw(/Invalid argument/);
  });

  it('returns error if the object matcher returns one', function() {
    var schema = objectWithOnly({
      name: string(),
      age:  number()
    });

    schema('', 'bob').should.eql([{
      path: '',
      value: 'bob',
      message: 'should be an object'
    }]);
  });

  it('matches objects', function() {
    var schema = objectWithOnly({
      name: string(),
      age:  number()
    });

    schema('', {name: 'bob', age: 21}).should.not.have.error();
  });

  it('allows missing keys if they are optional', function() {
    var schema = objectWithOnly({
      name: s.optional('string'),
      age:  number()
    });

    schema('', {age: 21}).should.not.have.error();
  });

  it('rejects if there are extra keys', function() {
    var schema = objectWithOnly({
      name: string(),
      age:  number()
    });

    schema('', {name: 'bob', age: 21, email: "bob@email.com"}).should.eql([{
      path: 'email',
      value: "bob@email.com",
      message: 'should not exist'
    }])
  });

  it('should not validate nested objects', function() {
    var schema = objectWithOnly({
      name: string(),
      age:  number(),
      address: {
        email: string()
      }
    });

    var bob = {
      name: 'bob',
      age: 21,
      address: {
        email: "bob@email.com",
        home: "21 bob street"
      }
    }

    schema('', bob).should.not.have.error()
  });

  it('can be used within nested objects and arrays', function() {
    var schema = objectWithOnly({
      name: 'string',
      firstBorn: objectWithOnly({
        name: 'string',
        age: 'number'
      }),
      address: array({of: objectWithOnly({
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
    schema('', bob).should.eql([{
      path: 'firstBorn.email',
      value: 'jane@bobismydad.com',
      message: 'should not exist'
    },{
      path: 'address[0].street',
      value: 'watt st',
      message: 'should not exist'
    }])
  })
  
});
