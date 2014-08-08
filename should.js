var s = require('./lib/index');

module.exports = function(should) {

  should.Assertion.prototype.structure = function(spec) {
    var errors = s(spec)(this.obj);
    var mapped = errors.map(function(err) {
      return err.path + ' ' + err.message;
    });
    this.params = {
      actual: this.obj,
      expected: mapped,
      operator: 'to match a given structure, but had'
    }
    this.assert(this.negate ? errors.length > 0 : errors.length === 0);
    return this;
  };

};
