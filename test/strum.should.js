var should = require('should');
var strum  = require('../index');

should.Assertion.prototype.structure = function(spec){
  var errors = strum(spec)(this.obj);
  var mapped = errors.map(function(err) {
    return err.path + ' ' + err.message + ' (but was ' + err.value + ')';
  });
  if (errors.length > 0) {
    throw new Error(
      'Expected ' +
      require('util').inspect(this.obj) +
      'to have a given structure, but failed because: ' +
      mapped.join('\n')
    );
  }
  return this;
};
