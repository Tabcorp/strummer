var s = require('../../lib/index');

describe('array matcher', function() {

  it('validates arrays of matchers', function() {

    var schema = s({
      names: s.array({of: s.string()})
    });

    schema({
      names: ['bob', 3]
    }).should.eql([
      {
        path: 'names[1]',
        value: 3,
        message: 'should be a string'
      }
    ]);

  });

  it('can omit the <of> keyword', function() {

    var schema = s({
      names: s.array(s.string())
    });

    schema({
      names: ['bob', 3]
    }).should.eql([
      {
        path: 'names[1]',
        value: 3,
        message: 'should be a string'
      }
    ]);

  });

  it('can specify the matcher name as a string', function() {

    var schema = s({
      names: s.array('string')
    });

    schema({
      names: ['bob', 3]
    }).should.eql([
      {
        path: 'names[1]',
        value: 3,
        message: 'should be a string'
      }
    ]);

  });

  it('can specify the <of> matcher name as a string', function() {

    var schema = s({
      names: s.array({of: 'string'})
    });

    schema({
      names: ['bob', 3]
    }).should.eql([
      {
        path: 'names[1]',
        value: 3,
        message: 'should be a string'
      }
    ]);

  });

});
