var inherits = require('./utils').inherits;
var Matcher  = require('./matcher');

function noop() {}

function matcherFactory(define) {
  var initialize = define.initialize || noop;

  function M(opts, params) {
    if (this instanceof M === false) {
      return new M(opts, params);
    }
    Matcher.call(this, opts);
    initialize.call(this, opts, params);
  }

  inherits(M, Matcher);

  if (!define.match) {
    throw new Error('match is not implemented');
  }

  M.prototype._match = define.match;
  M.prototype._safeParse = define.safeParse;
  M.prototype._toJSONSchema = define.toJSONSchema;

  return M;
}

module.exports = matcherFactory;
