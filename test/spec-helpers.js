var should     = require('should');
var blanket    = require('blanket');
var requireDir = require('require-dir');

// require all <lib> code to get full code coverage
// (even if a file doesn't have tests)
requireDir(__dirname + '/../lib', {recurse: true, duplicates: true});

should.Assertion.prototype.error = function(regex) {
  var found = this.obj.filter(function(err) {
    if (typeof regex === 'string') return err.message === regex;
    if (regex && regex.test) return regex.test(err.message);
    else return true;
  });
  this.params = {
    actual: this.obj,
    operator: 'to have',
    expected: regex ? regex : 'any error'
  };
  this.assert(this.negate ? found.length === 0 : found.length > 0);
  return this;
};

should.Assertion.prototype.errors = function(errors) {
  errors.forEach(function(err) {
    this.obj.should.have.error(err);
  });
};
