var object = require('../../lib/matchers/object');
var string = require('../../lib/matchers/string');
var number = require('../../lib/matchers/number');

describe('object matcher', function() {

    it('validates flat objects', function() {
      var schema = object({
        name: string(),
        age:  number()
      });

      schema('', {
        name: 'bob',
        age: 'foo'
      }).should.eql([{
        path: 'age',
        value: 'foo',
        message: 'should be a number'
      }]);
    });

    it('prepends the root path to the error path', function() {
      var schema = object({
        name: string(),
        age:  number()
      });

      schema('root', {
        name: 'bob',
        age: 'foo'
      }).should.eql([{
        path: 'root.age',
        value: 'foo',
        message: 'should be a number'
      }]);
    });

    it('validates nested objects', function() {
      var schema = object({
        name: string(),
        address: {
          street: string(),
          city: string(),
          postcode: number()
        }
      });

      schema('', {
        name: 'bob',
        address: {
          street: 'Pitt St',
          city: null,
          postcode: 'foo'
        }
      }).should.eql([{
        path: 'address.city',
        value: null,
        message: 'should be a string'
      }, {
        path: 'address.postcode',
        value: 'foo',
        message: 'should be a number'
      }]);
    });


    it('supports syntactic sugar by calling s() on each matcher', function() {
      var schema = object({
        name: 'string',
        address: {
          street: 'string',
          city: 'string',
          postcode: 'number'
        }
      });

      schema('', {
        name: 'bob',
        address: {
          street: 'Pitt St',
          city: null,
          postcode: 'foo'
        }
      }).should.eql([{
        path: 'address.city',
        value: null,
        message: 'should be a string'
      },
      {
        path: 'address.postcode',
        value: 'foo',
        message: 'should be a number'
      }]);
    });

});
