var s = require('../lib/index');

describe('syntactic sugar', function() {

  it('can use the matchers name instead of the function', function() {

    var schema = s({
      name: 'string',
      age:  'number'
    });

    schema({
      name: 'bob',
      age: 'foo'
    }).should.eql([
      {
        path: 'age',
        value: 'foo',
        message: 'should be a number'
      }
    ]);

  });

});
