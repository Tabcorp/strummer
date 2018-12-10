var constraints = require('../lib/constraints');

describe('constraints', function () {
  it('returns empty array if no errors', function () {
    var func = function () { return null };

    constraints.validate(null, null, func).should.deepEqual([])
  });

  it('returns errors from constraint function', function () {
    var func = function () { return {
        error: 'this is an error'
      }
    };

    constraints.validate(null, null, func).should.deepEqual({
      error: 'this is an error'
    })
  });
})
