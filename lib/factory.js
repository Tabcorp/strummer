var inherits = require('util').inherits;
var Matcher  = require('./matcher.js');

function matcherFactory(define) {
  function M(opts) {
    if (this instanceof M === false) {
      return new M(opts);
    }
    Matcher.call(this, opts);
    define.initialize.call(this, opts);
  }

  inherits(M, Matcher);

  M.prototype._match = define.match;

  return M;
}

module.exports = matcherFactory;
