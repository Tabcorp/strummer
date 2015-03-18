var number = require('../../lib/matchers/number');

describe('number matcher', function() {

  it('matches integers and floats', function() {
    number()('', 0).should.not.have.error();
    number()('', 3).should.not.have.error();
    number()('', 3.5).should.not.have.error();
  });

  it('fails for other types', function() {
    number()('', null).should.have.error(/should be a number/);
    number()('', 'foo').should.have.error(/should be a number/);
    number()('', true).should.have.error(/should be a number/);
  });

  it('supports min and max', function() {
    number({min: 3})('', 0).should.have.error(/should be a number >= 3/);
    number({min: 0})('', -10).should.have.error(/should be a number >= 0/);
    number({max: 0})('', 12).should.have.error(/should be a number <= 0/);
    number({max: 3})('', 5).should.have.error(/should be a number <= 3/);
    number({min: 3, max: 5})('', 7).should.have.error(/should be a number between 3 and 5/);
  });

  it('fails for invalid min or max values', function(){
    var shouldFail = function(val) {
      (function(){
        number({min: val});
      }).should.throw('Invalid minimum option: ' + val);

      (function(){
        number({max: val});
      }).should.throw('Invalid maximum option: ' + val);
    }

    var invalidValues = ['a', '', {}, []];
    invalidValues.forEach(shouldFail);
  });

  it('can parse string into number', function() {
    number({parse: true})('', 0).should.not.have.error();
    number({parse: true})('', 3).should.not.have.error();
    number({parse: true})('', 3.5).should.not.have.error();
    number({parse: true})('', '0').should.not.have.error();
    number({parse: true})('', '3').should.not.have.error();
    number({parse: true})('', '3.5').should.not.have.error();
    number({parse: true})('', '-3.5').should.not.have.error();
    number({parse: true})('', '+3.5').should.not.have.error();
  });

  it('fails for values that cannot be parsed into a number', function() {
    number({parse: true})('', null).should.have.error(/should be a number/);
    number({parse: true})('', undefined).should.have.error(/should be a number/);
    number({parse: true})('', "hello").should.have.error(/should be a number/);
    number({parse: true})('', {hello: 'world'}).should.have.error(/should be a number/);
    number({parse: true})('', false).should.have.error(/should be a number/);
    number({parse: true})('', true).should.have.error(/should be a number/);
  });

});
