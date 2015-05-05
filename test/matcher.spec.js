var inherits = require('util').inherits;
var Matcher  = require('../lib/matcher');
var factory  = require('../lib/factory');

describe('Matcher',function(){

  describe('is',function(){

    it('returns false when it is compared to null',function(){
      Matcher.is(null).should.eql(false);
    });

    it('returns true when a strummer matcher is passed',function(){
      var DummyMatcher = factory({
        match: function(){
          return false;
        }
      });

      inherits(DummyMatcher,Matcher)

      Matcher.is(new DummyMatcher()).should.eql(true);
    });

  });

});
