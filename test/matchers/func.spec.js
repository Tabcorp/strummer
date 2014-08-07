var func = require('../../lib/matchers/func');

describe('func matcher', function() {

  function zero()     {}
  function one(a)     {}
  function two(a, b)  {}

  it('matches functions', function() {
    func()('', zero).should.not.have.error();
    func()('', one).should.not.have.error();
  });

  it('rejects anything else', function() {
    func()('', 123).should.have.error(/should be a function/);
    func()('', 'foo').should.have.error(/should be a function/);
  });

  it('can specify the arity', function() {
    func({arity: 0})('', zero).should.not.have.error();
    func({arity: 1})('', one).should.not.have.error();
    func({arity: 2})('', two).should.not.have.error();
    func({arity: 0})('', one).should.have.error(/should be a function with 0 parameters/);
    func({arity: 1})('', two).should.have.error(/should be a function with 1 parameter/);
    func({arity: 2})('', zero).should.have.error(/should be a function with 2 parameters/);
  });

});
