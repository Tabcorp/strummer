var inherits = require('util').inherits;
var Matcher  = require('./matcher');

function noop() {}

function matcherFactory(define) {
  var initialize = define.initialize || noop;

  function M(opts) {
    if (this instanceof M === false) {
      return new M(opts);
    }
    Matcher.call(this, opts);
    initialize.call(this, opts);
  }

  inherits(M, Matcher);

  if (!define.match) {
    throw new Error('match is not implemented');
  }

  M.prototype._match = define.match;
  M.prototype._toJSONSchema = define.toJSONSchema;

  return M;
}

module.exports = matcherFactory;
