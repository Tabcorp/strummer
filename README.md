# Strum

> Structural-matching for JavaScript.

---

*This is an evolution of [js-match](https://github.com/TabDigital/js-match) for more flexibility.*
 
*But.... :warning: Very rough draft - work in progress.... please do not use :smile:*

---

### Main uses cases

- validating user input
- validating HTTP request payloads, to avoid having to check for each value before using it
- validating return values in test cases


### Table of contents

- [Getting started](#)
- [Getting to know the matchers](#)
- [A more complex example](#)
- [Defining custom matchers](#)
- [Should.js integration](#)


### Getting started

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
  }
});

console.log(person(bob));

// [
//   { path: 'name', value: null, message: 'should be a string' }
//   { path: 'address.postcode', value: 'NY', message: 'should be a number' }
// ]
```

### Getting to know the matchers

The example above is actually syntactic sugar for:

```js
var person = s({
  name: s.string(),
  age: s.number(),
  address: s.object({
    city: s.string(),
    postcode: s.number()
  })
});
```

This means all built-in matchers are functions,
and can potentially take extra parameters:

```
s.number({min:1, max:100})`
```

The full list of built-in matchers is:

- `s.string()`
- `s.number(min, max)`
- `s.object(fields)`
- `s.array(min, max, of)`
- `s.url()`
- `s.isoDate()`
- `s.uuid(version)`
- `s.enum(values)`

### A more complex example

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

Of course nothing prevents you from extracting reusable types:

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

### The case of arrays

`array` is probably the most flexible matcher.
Depending on how complex your configuration is,
you can use many different versions to be as legible as possible:

```js
nicknames: 'array'
nicknames: s.array('number')
nicknames: s.array(s.number({min: 5}));
nicknames: s.array({max: 3, of: 'number'})
nicknames: s.array({max: 3, of: s.number({min: 5})})
```

Or if you defined your custom type:

```js
var list = s({
  addresses: s.array(address);
});
```

### Defining custom matchers

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

### Should.js integration

Strum plays well with [should.js](#).

For quick-and-easy validation in your unit tests, you can use `have.structure`
which is loaded when you require strum.

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
