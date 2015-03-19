var utils    = require('../lib/utils');
var hasValue = utils.hasValue;

describe("hasValue() util function", function(){
  it('Should return false when value is <null>', function(){
    hasValue(null).should.be.false;
  });

  it('Should return false when value is <undefined>', function(){
    hasValue(undefined).should.be.false;
  });

  it('Should return true when value is a number', function(){
    hasValue(12).should.be.true;
  });

  it('Should return true when value is a string', function(){
    hasValue('a').should.be.true;
  });

  it('Should return true when value is <{}>', function(){
    hasValue({}).should.be.true;
  });

  it('Should return true when value is <"">', function(){
    hasValue('').should.be.true;
  });
});
