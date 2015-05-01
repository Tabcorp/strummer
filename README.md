# Strummer

> Structural-matching for JavaScript.

[![NPM](http://img.shields.io/npm/v/strummer.svg?style=flat-square)](https://npmjs.org/package/strummer)
[![License](http://img.shields.io/npm/l/strummer.svg?style=flat-square)](https://github.com/TabDigital/strummer)

[![Build Status](http://img.shields.io/travis/TabDigital/strummer.svg?style=flat-square)](http://travis-ci.org/TabDigital/strummer)
[![Test coverage](https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square)](http://travis-ci.org/TabDigital/strummer)

[![Dependencies](http://img.shields.io/david/TabDigital/strummer.svg?style=flat-square)](https://david-dm.org/TabDigital/strummer)
[![Dev dependencies](http://img.shields.io/david/dev/TabDigital/strummer.svg?style=flat-square)](https://david-dm.org/TabDigital/strummer)

## Main uses cases

- validating user input / config files
- validating inbound HTTP request payloads
- writing expressive unit tests

## Table of contents

- [Getting started](#getting-started)
- [Syntactic sugar](#syntactic-sugar)
- [A more complex example](#a-more-complex-example)
- [Optional values](#optional-values)
- [Defining custom matchers](#defining-custom-matchers)
- [Asserting on matchers](#asserting-on-matchers)
- [A note on performance](#a-note-on-performance)

## Getting started

```
npm install strummer
```

```js
var s = require('strummer');

var person = s({
  name: 'string',
  age: 'number',
  address: {
    city: 'string',
    postcode: 'number'
  },
  nicknames: ['string']
});

console.log(person.match(bob));

// [
//   { path: 'name', value: null, message: 'should be a string' }
//   { path: 'address.postcode', value: 'NY', message: 'should be a number' }
// ]
```

## Syntactic sugar

The example above is actually syntactic sugar for:

```js
var person = new s.object({
  name: new s.string(),
  age: new s.number(),
  address: new s.object({
    city: new s.string(),
    postcode: new s.number()
  }),
  nicknames: new s.array({of: new s.string()})
});
```

This means all matchers are actually instances of `s.Matcher`,
and can potentially take extra parameters.

```js
new s.number({min:1, max:100})
```

Built-in matchers include(all classes)

- `s.array({min, max, of})`
- `s.boolean()`
- `s.duration({min, max})`
- `s.enum({name, values, verbose})`
- `s.func({arity})`
- `s.hashmap({keys, values})`
- `s.integer({min, max})`
- `s.isoDate()`
- `s.number({min, max})`
- `s.object(fields)`
- `s.objectWithOnly(fields)`
- `s.regex(reg)`
- `s.string({min, max})`
- `s.url()`
- `s.uuid({version})`

They all come with [several usage examples](https://github.com/TabDigital/strummer/blob/master/MATCHERS.md).
Matchers usually support both simple / complex usages, with nice syntactic sugar.

## A more complex example

Here's an example that mixes nested objects, arrays,
and matches on different types with extra options.

```js
var person = new s.object({
  id: new s.uuid({version: 4}),
  name: 'string',
  age: new s.number({min: 1, max: 100}),
  address: {
    city: 'string',
    postcode: 'number'
  },
  nicknames: [{max: 3, of: 'string'}],
  phones: [{of: {
    type: new s.enum({values: ['MOBILE', 'HOME']}),
    number: 'number'
  }}]
});
```

You can of course extract matchers to reuse them,
or to make the hierarchy more legible.

```js
var age = new s.number({min: 1, max: 100})

var address = new s.object({
  city: 'string',
  postcode: 'number'
});

var person = new s.object({
  name: 'string',
  age: age,
  home: address
});
```

## Optional values

By default, all matchers expect the value to exist.
In other words every field is required in your schema definition.

You can make a field optional by using the special `{optional: true}` argument.,

```js
new s.number({optional: true, min: 1})
```

## Defining custom matchers

To define a customer matcher, simply inherit the `s.Matcher` prototype
and implement the `_match` function.

```js
var s = require('strummer');

function MyMatcher(opts) {
  s.Matcher.call(this, opts);
}

util.inherits(MyMatcher, s.Matcher);

MyMatcher.prototype._match = function(path, value) {
  // if this is a leaf matcher, we only care about the current value
  return null;
  return 'should be a string starting with ABC';
  // if this matcher has children, we need to return an array of errors;
  return [];
  return [
    { path: path + '[0]', value: value[0], message: 'should be > 10' }
    { path: path + '[1]', value: value[1], message: 'should be > 20' }
  ]
};
```

Or you can use the helper function to create it:

```js
var MyMatcher = s.createMatcher({
  initialize: function() {
    // initialize here
    // you can use "this" to store local data
  },
  match: function(path, value) {
    // validate here
    // you can also use "this"
  }
});
```

You can use these matchers like any of the built-in ones.

```js
new s.object({
  name: 'string',
  id: new MyMatcher({max: 3})
})
```

## Asserting on matchers

Matchers always return the following structure:

```js
[
  { path: 'person.name', value: null, message: 'should be a string' }
]
```

In some cases, you might just want to `throw` an error - for example in the context of a unit test.
Strummer provides the `s.assert` function for that purpose:

```js
s.assert(name, 'string');
// name should be a string (but was null)

s.assert(nicknames, ['string']);
// name[2] should be a string (but was 123)
// name[3] should be a string (but was 456)

s.assert(person, {
  name: 'string',
  age: new s.number({max: 200})
});
// person.age should be a number <= 200 (but was 250)
```

## JSON Schema Supports

Strummer can generate some simple JSON Schema from strummer definition.

```js
var schema = s({
  foo: 'string',
  bar: s.string({ optional: true }),
  num: s.number({ max: 100, min: 0 })
});

console.log(schema.toJSONSchema());
```

which will shows log like this:

```js
{
  type: 'object',
  required: ['foo', 'num'],
  properties: {
    foo: {
      type: 'string'
    },
    bar: {
      type: 'string'
    },
    num: {
      type: 'number',
      maximum: 100,
      minimum: 0
    }
  }
}
```

When you trying to create your own matcher which supports jsonSchema, then you needs to impement
the `toJSONSchema` option in the `createMatcher`, if `toJSONSchema` is not defined, when you call
`matcher.toJSONSchema()` it will return nothing.


## A note on performance

The 2 main rules for performance are:

- If you need to validate many objects of the same kind,
you should declare matchers upfront and reuse them.

- All syntactic sugar is processed at creation time.
This means shorthand notations don't cause any performance overhead
compared to their canonical equivalents.

Of course, actual performance depends on the complexity of your matchers / objects.
If you're interested in figures, some stats are printed as part of the unit test suite:

```js
new s.object({
  id: new s.uuid({version: 4}),
  name: 'string',
  age: new s.number({optional: true, min: 1, max: 100}),
  addresses: new s.array({of: {
    type: 'string',
    city: 'string',
    postcode: 'number'
  }}),
  nicknames: [{max: 3, of: 'string'}],
  phones: [{of: {
    type: new s.enum({values: ['MOBILE', 'HOME']}),
    number: /^[0-9]{10}$/
  }}]
})

// ┌───────────────────────┬─────────────────┐
// │ Number of validations │ Total time (ms) │
// ├───────────────────────┼─────────────────┤
// │ 10,000                │ 85              │
// └───────────────────────┴─────────────────┘
```
