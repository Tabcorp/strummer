# Built-in matchers

- [object](#)
- [array](#)
- [string](#)
- [number](#)

## object

## array

`array` is probably the most flexible matcher.
Depending on how complex your configuration is,
you can use many different versions to be as legible as possible:

```js
// referencing the matcher by name
nicknames: 'array'

// using the array notation on another matcher
nicknames: ['number']
nicknames: [s.number({min: 5})]
nicknames: [s.object({text: 'string'})]

// using the array matcher itself
nicknames: s.array('number')
nicknames: s.array(s.number({min: 5}));

// specify more array-matching options
nicknames: s.array({max: 3, of: 'number'})
nicknames: s.array({max: 3, of: s.number({min: 5})})
nicknames: s.array({max: 3, of: s.object({name: 'string'})})
```

## string

## number
