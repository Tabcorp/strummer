# Strum

> Structural-matching for JavaScript.

---

*This is an evolution of [js-match](https://github.com/TabDigital/js-match) for more flexibility.*

*But.... :warning: Very rough draft - work in progress.... please do not use :smile:*

---

## Main uses cases

- validating user input
- validating HTTP request payloads, to avoid having to check for each value before using it
- validating return values in test cases


## Table of contents

- [Getting started](#)
- [Getting to know the matchers](#)
- [A more complex example](#)
- [The case of arrays](#)
- [Defining custom matchers](#)
- [Should.js integration](#)


## Getting started

```
npm install strum
```

```js
var s = require('strum');

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

## Getting to know the matchers

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
and can potentially take extra parameters:

```js
s.number({min:1, max:100})
```

The full list of built-in matchers is:

- `s.object(fields)`
- `s.array(min, max, of)`
- `s.string()`
- `s.number(min, max)`
- `s.url()`
- `s.isoDate()`
- `s.uuid(version)`
- `s.enum(values)`
- `s.func(arity)`

## A more complex example

Here's an example that mixes nested objects, arrays,
and matches on different types with extra options.

This is the most spelled-out version,
calling each matcher function directly even when it's implicit.


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

## The case of arrays

`array` is probably the most flexible matcher.
Depending on how complex your configuration is,
you can use many different versions to be as legible as possible:

```js
// referencing the matcher by name
nicknames: 'array'

// using the array notation on another matcher
nicknames: ['number']
nicknames: [s.number({min: 5})]

// using the array matcher itself
nicknames: s.array('number')
nicknames: s.array(s.number({min: 5}));

// specify more array-matching options
nicknames: s.array({max: 3, of: 'number'})
nicknames: s.array({max: 3, of: s.number({min: 5})})
```

## Defining custom matchers

Matchers are functions that take one argument (`value`),
and return an error message if they didn't match.


```js
function myCustomId(value) {
  if (/^[a-f]{5}-[0-9]{5}$/.test(value) === false) {
    return 'should be a special ID';
  }
}
```

You can then reference that function directly:

```
s({
  name: 'string',
  id: myCustomId
})
```

For more flexibility, it's usually a good idea to let the matcher take optional arguments:

```js
function myCustomId(opts) {
  return s(function(value) {
    // ...
  });
}
```

## Should.js integration

Strum plays well with [should.js](#).

For quick-and-easy validation in your unit tests, you can use `have.structure`
which is loaded when you call `require('strum')`.

```js
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
