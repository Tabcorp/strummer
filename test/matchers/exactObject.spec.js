var exact  = require('../../lib/matchers/exactObject');
var string = require('../../lib/matchers/string');
var number = require('../../lib/matchers/number');
var s      = require('../../lib/s');

describe('exact object matcher', function() {

    it('cannot be called with anything but an object matcher', function() {
      (function() {
        var schema = exact('string');
      }).should.throw(/Invalid argument/);
    });

    it('returns error if the object matcher returns one', function() {
      var schema = exact({
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
      var schema = exact({
        name: string(),
        age:  number()
      });

      schema('', {name: 'bob', age: 21}).should.not.have.error();
    });

    it('allows missing keys if they are optional', function() {
      var schema = exact({
        name: s.optional('string'),
        age:  number()
      });

      schema('', {age: 21}).should.not.have.error();
    });

    it('rejects if there are extra keys', function() {
      var schema = exact({
        name: string(),
        age:  number()
      });

      schema('', {name: 'bob', age: 21, email: "bob@email.com"}).should.eql([{
        path: 'email',
        value: "bob@email.com",
        message: 'should not exist'
      }])
    });

    it('rejects extra keys in nested objects', function() {
      var schema = exact({
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

      schema('', bob).should.eql([{
        path: 'address.home',
        value: "21 bob street",
        message: 'should not exist'
      }])
    });





});
