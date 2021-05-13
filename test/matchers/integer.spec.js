var integer = require('../../lib/matchers/integer');

describe('integer matcher', function() {

  it('matches integers', function() {
    new integer().match('', 0).should.not.have.error();
    new integer().match('', 3).should.not.have.error();
    new integer().match('', -1).should.not.have.error();
  });

  it('fails for other types', function() {
    new integer().match('', null).should.have.error(/should be an integer/);
    new integer().match('', 'foo').should.have.error(/should be an integer/);
    new integer().match('', true).should.have.error(/should be an integer/);
    new integer().match('', 3.5).should.have.error(/should be an integer/);
  });

  it('supports min and max', function() {
    new integer({min: 3}).match('', 0).should.have.error(/should be an integer >= 3/);
    new integer({max: 3}).match('', 5).should.have.error(/should be an integer <= 3/);
    new integer({min: 3, max: 5}).match('', 7).should.have.error(/should be an integer between 3 and 5/);
    new integer({min: 0}).match('', -10).should.have.error(/should be an integer >= 0/);
    new integer({max: 0}).match('', 3).should.have.error(/should be an integer <= 0/);
  });

  it('fails for invalid min or max values', function() {
    var shouldFail = function(val) {
      (function(){
        new integer({min: val});
      }).should.throw('Invalid minimum option: ' + val);

      (function(){
        new integer({max: val});
      }).should.throw('Invalid maximum option: ' + val);
    }

    var invalidValues = ['a', '', {}, []];
    invalidValues.forEach(shouldFail);
  });

  it('can parse integer from string', function() {
    new integer({parse: true}).match('', 0).should.not.have.error();
    new integer({parse: true}).match('', 3).should.not.have.error();
    new integer({parse: true}).match('', -1).should.not.have.error();
    new integer({parse: true}).match('', "0").should.not.have.error();
    new integer({parse: true}).match('', "3").should.not.have.error();
    new integer({parse: true}).match('', "-1").should.not.have.error();
    new integer({parse: true}).match('', "+4").should.not.have.error();
  });

  it('fails if cannot be parsed to integer', function() {
    new integer({parse: true}).match('', null).should.have.error(/should be an integer/);
    new integer({parse: true}).match('', undefined).should.have.error(/should be an integer/);
    new integer({parse: true}).match('', false).should.have.error(/should be an integer/);
    new integer({parse: true}).match('', true).should.have.error(/should be an integer/);
    new integer({parse: true}).match('', 1.2).should.have.error(/should be an integer/);
    new integer({parse: true}).match('', "1.2").should.have.error(/should be an integer/);
    new integer({parse: true}).match('', "hello").should.have.error(/should be an integer/);
    new integer({parse: true}).match('', {hello: 'world'}).should.have.error(/should be an integer/);
    new integer({parse: true}).match('', "4L").should.have.error(/should be an integer/);
  });


  it('can converts to json-shema', function() {
    integer({ min: 1, max: 100 }).toJSONSchema().should.eql({
      type: 'integer',
      maximum: 100,
      minimum: 1
    });
  });

  it('can have optional maximum in json-schema', function() {
    integer({ min: 1 }).toJSONSchema().should.eql({
      type: 'integer',
      minimum: 1
    });
  });

  it('can have optional minimum in json-schema', function() {
    integer({ max: 100 }).toJSONSchema().should.eql({
      type: 'integer',
      maximum: 100
    });
  });

  it('can have no limit integer json-schema', function() {
    integer().toJSONSchema().should.eql({
      type: 'integer'
    });
  });

  it('can have optional description json-schema', function() {
    integer({ description: 'Lorem ipsum' }).toJSONSchema().should.eql({
      type: 'integer',
      description: 'Lorem ipsum'
    });
  });

  it('coerces the value to an integer', function() {
    integer({ parse: true, max: 100 }).safeParse('50').should.eql({ value: 50, errors: []});
  });

  it('does not coerce when coerce is set to false', function() {
    integer({ parse: true, max: 100, coerce: false }).safeParse('50').should.eql({ value: '50', errors: []});
  });

});
