var compile       = require('../lib/compile');
var factory       = require('../lib/factory');
var objectMatcher = require('../lib/matchers/object');

describe("Compile",function(){

  describe("spec",function(){

    it("should throw an exception if the object being passed does not match any of the matchers",function(){
      var someObjectNotAMatcher = {
        name: false
      };

      (function(){
        compile.spec(someObjectNotAMatcher);
      }).should.throw('Invalid matcher: false');
    });

    it("should use the object being passed as matcher if it is a strummer matcher",function(){
      var DummyMatcher = factory({
        match: function(){
          return false;
        }
      });
      var expectedMatcher = new DummyMatcher();

      var actualMatcher = compile.spec(expectedMatcher);

      actualMatcher.should.equal(expectedMatcher);
    });

    it("should create an object matcher if the object being passed matches the object matcher",function(){
      var objectWithoutAMatchMethod = {};

      var actualMatcher = compile.spec(objectWithoutAMatchMethod);

      actualMatcher.should.instanceof(objectMatcher)
    });

  });

});
