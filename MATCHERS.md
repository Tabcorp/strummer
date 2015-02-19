# Built-in matchers

- [array](#array)
- [boolean](#boolean)
- [duration](#duration)
- [enum](#enum)
- [exactObject](#exactObject)
- [func](#func)
- [hashmap](#hashmap)
- [integer](#integer)
- [isoDate](#isoDate)
- [number](#number)
- [object](#object)
- [regex](#regex)
- [string](#string)
- [url](#url)
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

## boolean

```js
// match a boolean
enabled: 'boolean'
enabled: s.boolean()

// optionally parse a string into a boolean e.g. "true"/"false"
enabled: s.boolean({parse: true})
```

## duration

Match a duration in the following format: `10s`, `5m`, `24h`...

```js
timespan: 'duration'
timespan: s.duration()
timespan: s.duration({min: '10s', max: '5m'})
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

## exactObject

Match an exact object.
This matcher will not error if any optional properties are left out.
This matcher will error if any extra properties passed in.

Each property must have a corresponding matcher, and they will be called recursively.

```js
// match exact object
person: 'exactObject'
person: s.exactObject()

// match an object with given properties
person: s.exactObject({
  name: 'string'
  age: 'number'
})

// match a nested object
person: s.exactObject({
  name: 'string'
  address: {
    city: 'string'
    postcode: 'number'
  }
})
```


## func

```js
// match any function
cb: 'func'
cb: s.func()

// match a function with 3 parameters
cb: s.func({arity: 3})
```

## hashmap

```js
// only match the value type
map: s.hashmap('number')
map: s.hashmap(s.number({max: 10}))

// match keys and value types
map: s.hashmap({
  keys: 'string'
  values: 'number'
})

// or using more complex matchers
map: s.hashmap({
  keys: /^[a-z]{5}$/
  values: s.array(s.number({max: 10}))
})
```

## integer

```js
// match any integer
numberOfKids: 'integer'
numberOfKids: s.integer()

// optional min and max value
numberOfKids: s.integer({min: 0, max: 100})

// optionally parse a string into an integer e.g. "120"
numberOfKids: s.integer({parse: true, min: 0, max: 100})
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
age: s.number()

// optional min and max value
age: s.number({min: 0, max: 100})

// optionally parse a string into a number e.g. "1"/"1.2"
age: s.number({parse: true})
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

## regex

```js
// match a given regex
name: /^[a-z]+$/i
name: s.regex(/^[a-z]+$/i)
```

## string

```js
// match any string
name: 'string'
name: s.string()
```

## url

```js
//match a valid url
address: 'url'
address: s.url()
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
