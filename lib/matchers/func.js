var factory = require('../factory');


module.exports = factory({
  initialize: function(opts) {
    this.opts = opts || {};
  },

  match: function(path, value) {
    var opts = this.opts;
    if (typeof value !== 'function') {
      return 'should be a function';
    }
    if (typeof(opts.arity) === 'number') {
      if (value.length !== opts.arity) {
        return 'should be a function with ' + opts.arity + ' parameter' + (opts.arity === 1 ? '' : 's');
      }
    }
  }
});
