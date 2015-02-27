# Strummer

> Structural-matching for JavaScript.

[![NPM](http://img.shields.io/npm/v/strummer.svg?style=flat)](https://npmjs.org/package/strummer)
[![License](http://img.shields.io/npm/l/strummer.svg?style=flat)](https://github.com/TabDigital/strummer)

[![Build Status](http://img.shields.io/travis/TabDigital/strummer.svg?style=flat)](http://travis-ci.org/TabDigital/strummer)
[![Dependencies](http://img.shields.io/david/TabDigital/strummer.svg?style=flat)](https://david-dm.org/TabDigital/strummer)
[![Dev dependencies](http://img.shields.io/david/dev/TabDigital/strummer.svg?style=flat)](https://david-dm.org/TabDigital/strummer)

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

console.log(person(bob));

// [
//   { path: 'name', value: null, message: 'should be a string' }
//   { path: 'address.postcode', value: 'NY', message: 'should be a number' }
// ]
```

## Syntactic sugar

The example above is actually syntactic sugar for:

```js
var person = s({
  name: s.string(),
  age: s.number(),
  address: s.object({
    city: s.string(),
    postcode: s.number()
  }),
  nicknames: s.array({of: s.string()})
});
```

This means all matchers are actually functions,
and can potentially take extra parameters.

```js
s.number({min:1, max:100})
```

Some of the most common built-in matchers are

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
var person = s({
  id: s.uuid({version: 4}),
  name: 'string',
  age: s.number({min: 1, max: 100}),
  address: {
    city: 'string',
    postcode: 'number'
  },
  nicknames: [{max: 3, of: 'string'}],
  phones: [{of: {
    type: s.enum({values: ['MOBILE', 'HOME']}),
    number: 'number'
  }}]
});
```

You can of course extract matchers to reuse them,
or to make the hierarchy more legible.

```js
var age = s.number({min: 1, max: 100})

var address = {
  city: 'string',
  postcode: 'number'
};

var person: s({
  name: 'string',
  age: age,
  home: address
});
```

## Optional values

By default, all matchers expect the value to exist.
In other words every field is required in your schema definition.

You can make a field optional by using the special `s.optional` matcher,
which wraps any existing matcher.

```js
// wrapping a shorthand notation
name: s.optional('string'),

// wrapping an actual matcher
age: s.optional(s.number({min: 1})),

// wrapping a matcher defined somewhere else
home: s.optional(address)
```

## Defining custom matchers

Matchers are functions that return one or more errors for a given value.
The canonical form is:

```js
function myMatcher(opts) {
  return function(path, value) {
    if (/* the value is not right */) {
      return [{
        path: 'some.field',
        value: 'hello',
        message: 'should be different'
      }];
    }
  };
}
```

In most cases though, you won't need to report a different `path` or `value` from the ones that are passed in.
These simpler matchers can be defined as:

```js
function myMatcher(opts) {
  return s(function(value) {
    if (/* the value is not right */) {
      return 'should be different';
    }
  });
}
```

You can use these matchers like any of the built-in ones.

```js
s({
  name: 'string',
  id: myMatcher({max: 3})
})
```

## Asserting on matchers

Matchers normally return the following structure:

```js
[
  { path: 'person.name', value: null, message: 'should be a string' }
]
```

In some cases, you simply want to `throw` any errors - for example in the context of a unit test.
Strummer provides the `s.assert` function for that purpose:

```js
s.assert(name, 'string');
// name should be a string (but was null)

s.assert(nicknames, ['string']);
// name[2] should be a string (but was 123)
// name[3] should be a string (but was 456)

s.assert(person, {
  name: 'string',
  age: s.number({max: 200})
});
// person.age should be a number <= 200 (but was 250)
```

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
s({
  id: s.uuid({version: 4}),
  name: 'string',
  age: s.optional(s.number({min: 1, max: 100})),
  addresses: s.array({of: {
    type: 'string',
    city: 'string',
    postcode: 'number'
  }}),
  nicknames: [{max: 3, of: 'string'}],
  phones: [{of: {
    type: s.enum({values: ['MOBILE', 'HOME']}),
    number: /^[0-9]{10}$/
  }}]
})

// ┌───────────────────────┬─────────────────┐
// │ Number of validations │ Total time (ms) │
// ├───────────────────────┼─────────────────┤
// │ 10,000                │ 294             │
// └───────────────────────┴─────────────────┘
```
