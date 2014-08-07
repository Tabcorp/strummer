# Strummer

> Structural-matching for JavaScript.

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
- `s.url()`
- `s.isoDate()`
- `s.uuid(version)`
- `s.enum(values)`
- `s.func(arity)`

You can find more examples for each matcher at [MATCHERS](https://github.com/rprieto/strummer/blob/master/README-MATCHERS.md).
Each matcher might support both complex parameters and nice syntactic sugar.
This is particularly true for arrays.

```js
'array'
s.array('number')
s.array({max: 3, of: 'number'})
s.array({max: 3, of: s.number({min: 5})})
```

## A more complex example

Here's an example that mixes nested objects, arrays,
and matches on different types with extra options.
This is the most spelled-out version,
calling each matcher function directly even when it could be implicit.


```js
var person = s({
  name: s.string(),
  age: s.number({min: 1, max: 100}),
  address: s.object({
    city: s.string(),
    postcode: s.number()
  }),
  nicknames: s.array({max: 3, of: s.string()})
  phones: s.array({min: 1, of: {
    type: s.enum({values: ['MOBILE', 'HOME']}),
    number: s.number()
  }})
});
```

You can of course extract matchers to reuse them,
or to make the hierarchy more legible.

```js
var address = {
  city: s.string(),
  postcode: s.number()
};

var person: s({
  name: 'string',
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
