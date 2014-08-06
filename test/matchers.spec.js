var should = require('should');
var m      = require('../lib/matchers');

describe('matchers', function() {

  describe('number', function() {

    it('matches integers and floats', function() {
      m.number()('', 0).should.not.have.error();
      m.number()('', 3).should.not.have.error();
      m.number()('', 3.5).should.not.have.error();
    });

    it('fails for other types', function() {
      m.number()('', null).should.have.error(/should be a number/);
      m.number()('', 'foo').should.have.error(/should be a number/);
      m.number()('', true).should.have.error(/should be a number/);
    });

    it('supports min and max', function() {
      m.number({min: 3})('', 0).should.have.error(/should be above 3/);
      m.number({max: 3})('', 5).should.have.error(/should be below 3/);
      m.number({min: 3, max: 5})('', 7).should.have.error(/should be between 3 and 5/);
    });

  });

});
