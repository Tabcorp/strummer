var number = require('../../lib/matchers/number');

describe('number matcher', function() {

  it('matches integers and floats', function() {
    new number().match('', 0).should.not.have.error();
    new number().match('', 3).should.not.have.error();
    new number().match('', 3.5).should.not.have.error();
  });

  it('fails for other types', function() {
    new number().match('', null).should.have.error(/should be a number/);
    new number().match('', 'foo').should.have.error(/should be a number/);
    new number().match('', true).should.have.error(/should be a number/);
  });

  it('supports min and max', function() {
    new number({min: 3}).match('', 0).should.have.error(/should be a number >= 3/);
    new number({min: 0}).match('', -10).should.have.error(/should be a number >= 0/);
    new number({max: 0}).match('', 12).should.have.error(/should be a number <= 0/);
    new number({max: 3}).match('', 5).should.have.error(/should be a number <= 3/);
    new number({min: 3, max: 5}).match('', 7).should.have.error(/should be a number between 3 and 5/);
  });

  it('fails when max less than min', function() {
    (function() {
      new number({min: 5, max: 3})
    }).should.throw(/Invalid option/);
  });

  it('fails for invalid min or max values', function(){
    var shouldFail = function(val) {
      (function(){
        new number({min: val});
      }).should.throw('Invalid minimum option: ' + val);

      (function(){
        new number({max: val});
      }).should.throw('Invalid maximum option: ' + val);
    }

    var invalidValues = ['a', '', {}, []];
    invalidValues.forEach(shouldFail);
  });

  it('can parse string into number', function() {
    new number({parse: true}).match('', 0).should.not.have.error();
    new number({parse: true}).match('', 3).should.not.have.error();
    new number({parse: true}).match('', 3.5).should.not.have.error();
    new number({parse: true}).match('', '0').should.not.have.error();
    new number({parse: true}).match('', '3').should.not.have.error();
    new number({parse: true}).match('', '3.5').should.not.have.error();
    new number({parse: true}).match('', '-3.5').should.not.have.error();
    new number({parse: true}).match('', '+3.5').should.not.have.error();
  });

  it('fails for values that cannot be parsed into a number', function() {
    new number({parse: true}).match('', null).should.have.error(/should be a number/);
    new number({parse: true}).match('', undefined).should.have.error(/should be a number/);
    new number({parse: true}).match('', "hello").should.have.error(/should be a number/);
    new number({parse: true}).match('', {hello: 'world'}).should.have.error(/should be a number/);
    new number({parse: true}).match('', false).should.have.error(/should be a number/);
    new number({parse: true}).match('', true).should.have.error(/should be a number/);
  });

});
