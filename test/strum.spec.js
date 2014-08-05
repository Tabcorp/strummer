var should = require('should');
var s      = require('../index');

s.integrate(require('should').Assertion);

describe('strum', function() {

  describe('structure', function() {

    it('validates flat objects', function() {

      var schema = s({
        name: s.string(),
        age:  s.number()
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

    it('validates nested objects', function() {

      var schema = s({
        name: s.string(),
        address: {
          street: s.string(),
          city: s.string(),
          postcode: s.number()
        }
      });

      schema({
        name: 'bob',
        address: {
          street: 'Pitt St',
          city: null,
          postcode: 'foo'
        }
      }).should.eql([
        {
          path: 'address.city',
          value: null,
          message: 'should be a string'
        },
        {
          path: 'address.postcode',
          value: 'foo',
          message: 'should be a number'
        }
      ]);

    });

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
