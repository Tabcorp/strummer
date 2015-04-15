var func = require('../../lib/matchers/func');

describe('func matcher', function() {

  function zero()     {}
  function one(a)     {}
  function two(a, b)  {}

  it('matches functions', function() {
    new func().match('', zero).should.not.have.error();
    new func().match('', one).should.not.have.error();
  });

  it('rejects anything else', function() {
    new func().match('', 123).should.have.error(/should be a function/);
    new func().match('', 'foo').should.have.error(/should be a function/);
  });

  it('can specify the arity', function() {
    new func({arity: 0}).match('', zero).should.not.have.error();
    new func({arity: 1}).match('', one).should.not.have.error();
    new func({arity: 2}).match('', two).should.not.have.error();
    new func({arity: 0}).match('', one).should.have.error(/should be a function with 0 parameters/);
    new func({arity: 1}).match('', two).should.have.error(/should be a function with 1 parameter/);
    new func({arity: 2}).match('', zero).should.have.error(/should be a function with 2 parameters/);
  });

});
