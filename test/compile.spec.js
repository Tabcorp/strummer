var compile       = require('../lib/compile');
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

    it("should use the object being passed as a matcher if it has a match method",function(){
      var objectWithAMatchMethod = {
        match:function(){
          return "some value"
        }
      };

      var actualMatcher = compile.spec(objectWithAMatchMethod);

      actualMatcher.should.equal(objectWithAMatchMethod);
    });

    it("should create an object matcher if the object being passed does not have a match method",function(){
      var objectWithoutAMatchMethod = {};

      var actualMatcher = compile.spec(objectWithoutAMatchMethod);

      actualMatcher.should.instanceof(objectMatcher)
    });

  });

});
