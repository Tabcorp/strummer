var s = require('../lib/index');

describe('objects', function() {

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


    it('supports syntactic sugar by calling s() on each matcher', function() {

      var schema = s({
        name: 'string',
        address: {
          street: 'string',
          city: 'string',
          postcode: 'number'
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
