var integer = require('../../lib/matchers/integer');

describe('integer matcher', function() {

  it('matches integers', function() {
    integer()('', 0).should.not.have.error();
    integer()('', 3).should.not.have.error();
    integer()('', -1).should.not.have.error();
  });

  it('fails for other types', function() {
    integer()('', null).should.have.error(/should be an integer/);
    integer()('', 'foo').should.have.error(/should be an integer/);
    integer()('', true).should.have.error(/should be an integer/);
    integer()('', 3.5).should.have.error(/should be an integer/);
  });

  it('supports min and max', function() {
    integer({min: 3})('', 0).should.have.error(/should be an integer >= 3/);
    integer({max: 3})('', 5).should.have.error(/should be an integer <= 3/);
    integer({min: 3, max: 5})('', 7).should.have.error(/should be an integer between 3 and 5/);
    integer({min: 0})('', -10).should.have.error(/should be an integer >= 0/);
    integer({max: 0})('', 3).should.have.error(/should be an integer <= 0/);
  });

  it('fails for invalid min or max values', function(){
    var shouldFail = function(val) {
      (function(){
        integer({min: val});
      }).should.throw('Invalid minimum option: ' + val);

      (function(){
        integer({max: val});
      }).should.throw('Invalid maximum option: ' + val);
    }

    var invalidValues = ['a', '', {}, []];
    invalidValues.forEach(shouldFail);
  });

  it('can parse integer from string', function() {
    integer({parse: true})('', 0).should.not.have.error();
    integer({parse: true})('', 3).should.not.have.error();
    integer({parse: true})('', -1).should.not.have.error();
    integer({parse: true})('', "0").should.not.have.error();
    integer({parse: true})('', "3").should.not.have.error();
    integer({parse: true})('', "-1").should.not.have.error();
    integer({parse: true})('', "+4").should.not.have.error();
  });

  it('fails if cannot be parsed to integer', function() {
    integer({parse: true})('', null).should.have.error(/should be an integer/);
    integer({parse: true})('', undefined).should.have.error(/should be an integer/);
    integer({parse: true})('', false).should.have.error(/should be an integer/);
    integer({parse: true})('', true).should.have.error(/should be an integer/);
    integer({parse: true})('', 1.2).should.have.error(/should be an integer/);
    integer({parse: true})('', "1.2").should.have.error(/should be an integer/);
    integer({parse: true})('', "hello").should.have.error(/should be an integer/);
    integer({parse: true})('', {hello: 'world'}).should.have.error(/should be an integer/);
    integer({parse: true})('', "4L").should.have.error(/should be an integer/);
  });



});
