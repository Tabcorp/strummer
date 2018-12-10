var relate = require('../lib/relate');

describe('relate', function () {
  it('throws an error if relation is not in the schema', function () {
    var spec = {
      param: 'should exist'
    }

    var errors = relate.validate(
      spec,
      '',
      {},
      [{ values: ['param2'] }]
    )

    errors.should.deepEqual([
      {
        path: '',
        value: 'param2',
        message: 'param2 does not exist in the schema'
      }
    ])
  })

  it('should return no errors on valid relationship', function () {
    var spec = {
      param: 'should exist',
      param2: 'will exist'
    }

    var relationships = [
      {
        type: 'and',
        values: ['param', 'param2']
      }
    ]

    var errors = relate.validate(spec, '', { param: 'value', param2: 'value2' }, relationships)

    errors.should.deepEqual([])
  })

  it('should throw errors on missing and relation', function () {
    var spec = {
      param: 'should exist',
      param2: 'will exist'
    }

    var relationships = [
      {
        type: 'and',
        values: ['param', 'param2']
      }
    ]

    var errors = relate.validate(spec, '', { param: 'value' }, relationships)

    errors.should.deepEqual([
      {
        path: '',
        value: ['param', 'param2'],
        message: '["param","param2"] are related and therefore required'
      }
    ])
  })

  it('should throw errors on missing or relation', function () {
    var spec = {
      param: 'should exist',
      param2: 'will exist',
      param3: 'wont exist'
    }

    var relationships = [
      {
        type: 'or',
        values: ['param', 'param2']
      }
    ]

    var errors = relate.validate(spec, '', { param3: 'value' }, relationships)

    errors.should.deepEqual([
      {
        path: '',
        value: ['param', 'param2'],
        message: 'at least one of ["param","param2"] are required'
      }
    ])
  })
})
