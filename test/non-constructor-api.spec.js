var s = require('../lib/strummer');

describe('non constructor api', function() {

  it('can use the direct function call to create matcher instance', function() {
    var schema = s.string();
    schema.match(3).should.eql([{
      path: '',
      value: 3,
      message: 'should be a string'
    }]);
  });

  it('can create a matcher which returns new matcher instance from direct function call', function() {
    var CustomMatcher = s.createMatcher({
      initialize: function() {},
      match: function(path, value) {
        if (value !== 'hehe') {
          return 'value should be hehe';
        }
      }
    });

    var cm = CustomMatcher();
    cm.match('boom').should.eql([{
      path: '',
      value: 'boom',
      message: 'value should be hehe'
    }]);
  });
});
