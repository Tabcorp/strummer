require('../../lib/strummer');
var object = require('../../lib/matchers/object');
var string = require('../../lib/matchers/string');
var number = require('../../lib/matchers/number');
var factory = require('../../lib/factory');
var Matcher = require('../../lib/matcher');
var boolean = require('../../lib/matchers/boolean');

describe('object matcher', function() {

    it('rejects null values', function() {
      var schema = new object({
        name: new string(),
        age: new number()
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
        age: new number()
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
        match: function() {}
      };

      new object({
        name: valueMatcher
      }).match('', {
        name: 'bob'
      }).should.eql([]);
    });

    it('creates json schema with all required fields', function() {
      var matcher = new object({
        foo: 'string',
        bar: 'number'
      });

      matcher.toJSONSchema().required.should.containEql('foo');
      matcher.toJSONSchema().required.should.containEql('bar');
    });

    it('creates json schema without optional fields', function() {
      var matcher = new object({
        foo: string({ optional: true }),
        bar: 'number'
      });

      matcher.toJSONSchema().required.should.not.containEql('foo');
      matcher.toJSONSchema().required.should.containEql('bar');
    });

    it('creates json schema with all optional fields', function() {
      var matcher = new object({
        foo: string({ optional: true })
      });

      matcher.toJSONSchema().should.not.have.property('required');
    });

    it('generate json schema properties', function() {
      var matcher = new object({
        foo: number({ max: 100, min: 1 })
      });

      matcher.toJSONSchema().should.eql({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'number',
            maximum: 100,
            minimum: 1
          }
        }
      });
    });

    it('generate json schema with description option', function() {
      var matcher = new object(
        { foo: number({ max: 100, min: 1 }) },
        { description: 'Lorem ipsum' }
      );

      matcher.toJSONSchema().should.eql({
        type: 'object',
        required: ['foo'],
        description: 'Lorem ipsum',
        properties: {
          foo: {
            type: 'number',
            maximum: 100,
            minimum: 1
          }
        }
      });
    });

    it('will parse a valid flat object', function() {
      var matcher = new object({ foo: boolean() });
      matcher.safeParse({ foo: 'true' }).should.eql({ errors: [], value: { foo: true }})
    });

    it('will parse an invalid flat object', function() {
      var matcher = new object({ foo: boolean() });
      matcher.safeParse({ foo: 'bar' }).should.eql({errors: [{path: 'foo', message: 'should be a boolean'}]})
    });

    it('will parse an valid nested object', function() {
      var matcher = new object({ foo: object({ bar: boolean() }) });
      matcher.safeParse({ foo: { bar: 'false' } }).should.eql({ errors: [], value: { foo: { bar: false } }})
    });

    it('will parse an invalid nested object', function() {
      var matcher = new object({ foo: object({ bar: boolean() }) });
      matcher.safeParse({ foo: 'true' }).should.eql({errors: [{ message: 'should be an object', path: 'foo', value: 'true'}]})
    });

    it('will not generate json schema for the property which generate nothing', function() {
      var custom = factory({
        initialize: function() {},
        match: function() {}
      });

      var matcher = new object({
        foo: number({ max: 100, min: 1 }),
        bar: custom()
      });

      matcher.toJSONSchema().should.eql({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'number',
            maximum: 100,
            minimum: 1
          }
        }
      });
    });
});
