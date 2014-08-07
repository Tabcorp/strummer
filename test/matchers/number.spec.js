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
    number({min: 3})('', 0).should.have.error(/should be above 3/);
    number({max: 3})('', 5).should.have.error(/should be below 3/);
    number({min: 3, max: 5})('', 7).should.have.error(/should be between 3 and 5/);
  });

});
