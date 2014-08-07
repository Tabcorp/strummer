# Built-in matchers

- [array](#array)
- [enum](#enum)
- [isoDate](#isoDate)
- [number](#number)
- [object](#object)
- [string](#string)
- [uuid](#uuid)

## array

```js
// match any array
nicknames: 'array'

// match an array of matchers
nicknames: ['number']
nicknames: [s.number({min: 5})]
nicknames: [s.object({text: 'string'})]

// match an array of matchers (full syntax)
nicknames: s.array('number')
nicknames: s.array(s.number({min: 5}));

// optional min and max number of elements
nicknames: s.array({min: 3, of: 'number'})
nicknames: s.array({max: 7, of: s.number({min: 5})})
nicknames: s.array({max: 7, of: s.object({name: 'string'})})
```

## enum

```js
// list of possible values
state: s.enum({values: ['NSW', 'VIC']})

// displays "should be a valid state"
state: s.enum({values: ['NSW', 'VIC'], name:'state'})

// displays "should be a valid state (NSW,VIC)"
state: s.enum({values: ['NSW', 'VIC'], name:'state', verbose: true})
```

## isoDate

Match a date in ISO8601 format (string).
For example: `2014-12-31T23:59:59.999Z`

```js
updated: 'isoDate'
updated: s.isoDate()
```

## number

```js
// match any number
age: 'number'
age s.number()

// optional min and max value
age s.number({min: 0, max: 100})
```

## object

Match an object, with an optional list of properties.
This matcher will ignore any extra properties that are not mentioned.

Each property must have a corresponding matcher, and they will be called recursively.

```js
// match any object
person: 'object'
person: s.object()

// match an object with given properties
person: s.object({
  name: 'string'
  age: 'number'
})

// can be simplified to
person: {
  name: 'string'
  age: 'number'
}

// match a nested object
person: {
  name: 'string'
  address: {
    city: 'string'
    postcode: 'number'
  }
}
```

## string

```js
// match any string
name: 'string'
name: s.string()
```

## uuid

Match a [universally unique identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier).
The standard defines the format as `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`.

```js
// match any valid UUID
id: 'uuid'
id: s.uuid()

// only match a specific version
id: s.uuid({version: 4})
```
