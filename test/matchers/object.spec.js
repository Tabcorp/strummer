require('../../lib/strummer');
var object = require('../../lib/matchers/object');
var string = require('../../lib/matchers/string');
var number = require('../../lib/matchers/number');
var Matcher = require('../../lib/matcher');

describe('object matcher', function() {

    it('rejects null values', function() {
      var schema = new object({
        name: new string(),
        age:  new number()
      });

      schema.match('path.to.something', null).should.eql([{
        path: 'path.to.something',
        value: null,
        message: 'should be an object'
      }]);
    });

    it('rejects anything that isnt an object', function() {
      var schema = new object({
        name: new string(),
        age: new number()
      });

      schema.match('', 'bob').should.eql([{
        path: '',
        value: 'bob',
        message: 'should be an object'
      }]);
    });

    it('validates flat objects', function() {
      var schema = new object({
        name: new string(),
        age: new  number()
      });

      schema.match('', {
        name: 'bob',
        age: 'foo'
      }).should.eql([{
        path: 'age',
        value: 'foo',
        message: 'should be a number'
      }]);
    });

    it('prepends the root path to the error path', function() {
      var schema = new object({
        name: new string(),
        age: new number()
      });

      schema.match('root', {
        name: 'bob',
        age: 'foo'
      }).should.eql([{
        path: 'root.age',
        value: 'foo',
        message: 'should be a number'
      }]);
    });

    it('validates nested objects', function() {
      var schema = new object({
        name: new string(),
        address: {
          street: new string(),
          city: new string(),
          postcode: new number()
        }
      });

      schema.match('', {
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
      var schema = new object({
        name: 'string',
        address: {
          street: 'string',
          city: 'string',
          postcode: 'number'
        }
      });

      schema.match('', {
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

    it('handles falsy return values from value matchers', function() {
      var valueMatcher = {
        __proto__: new Matcher({}),
        match: function(path, sth) {}
      };

      new object({
        name: valueMatcher
      }).match('', {
        name: 'bob'
      }).should.eql([])
    });

});
