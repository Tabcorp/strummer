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
- [Defining custom matchers](#defining-custom-matchers)
- [Should.js integration](#shouldjs-integration)

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

- `s.object(fields)`
- `s.array(min, max, of)`
- `s.string()`
- `s.number(min, max)`
- `s.integer(min, max)`
- `s.boolean()`
- `s.url()`
- `s.isoDate()`
- `s.uuid(version)`
- `s.enum(name, values, verbose)`
- `s.func(arity)`

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
  }),
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

## Should.js integration

`Strummer` plays well with [should.js](https://github.com/shouldjs/should.js). For quick-and-easy validation
in your unit tests, you can use `have.structure` on entire objects.

```js
var should = require('should');
require('strummer/should')(should);

var person = {
  name: 'bob',
  age: 'foo'
};

person.should.have.structure({
  name: 'string',
  age: 'number'
});
```

This will fail the test with:

```
Expected {name: 'bob', age: 'foo'}
to match a given structure, but failed because
age should be a number (was 'foo')
```
