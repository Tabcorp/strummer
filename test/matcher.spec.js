var Matcher  = require('../lib/matcher');
var factory  = require('../lib/factory');

describe('Matcher', function() {

  describe('is', function() {

    it('returns false when it is compared to null', function() {
      Matcher.is(null).should.eql(false);
    });

    it('returns true when a strummer matcher is passed', function() {
      var DummyMatcher = factory({
        match: function() {
          return false;
        }
      });

      Matcher.is(new DummyMatcher()).should.eql(true);
    });

  });

  describe('#toJSONSchema', function() {

    it('generates named json schema when it have name', function() {
      var DummyMatcher = factory({
        match: function() {
          return true;
        },
        toJSONSchema: function() {
          return {
            type: 'number'
          };
        }
      });

      var m = new DummyMatcher();
      m.setName('Dummy');
      m.toJSONSchema().should.eql({
        name: 'Dummy',
        type: 'number'
      });
    });

  });

  describe('matcher', function() {

    it('calls constraint function and returns errors', function() {
      var DummyMatcher = factory({
        match: function() {
          return false;
        }
      });

      var constraintFunc = function (path, val) {
        if (val.shouldError) {
          return {
            path: path,
            value: val,
            error: true
          }
        }
      }

      var m = new DummyMatcher

      var path = '/'
      var value = {
        shouldError: true
      }

      m.match(path, value, constraintFunc).should.eql([{
        path: path,
        value: value,
        error: true
      }]);
    });

    it('returns empty array if no constraint errors', function() {
      var DummyMatcher = factory({
        match: function() {
          return false;
        }
      });

      var constraintFunc = function (path, val) {
        return []
      }

      var m = new DummyMatcher

      m.match('/', {}, constraintFunc).should.eql([]);
    });
  });

});
