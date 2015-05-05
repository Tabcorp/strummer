var PROPERTY_TO_FLAG_AS_STRUMMER_MATCHER = "IS-STRUMMER-MATCHER";

function Matcher(opts) {
  this.optional = opts && (opts.optional === true);
  Object.defineProperty(this, PROPERTY_TO_FLAG_AS_STRUMMER_MATCHER, {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });
}

Matcher.is = function(otherMatcher) {
  if (!otherMatcher) {
    return false;
  }
  return otherMatcher[PROPERTY_TO_FLAG_AS_STRUMMER_MATCHER];
};

function missing(value) {
  return value === null || typeof value === 'undefined';
}

Matcher.prototype.match = function(path, value) {
  if (arguments.length === 1) {
    value = path;
    path = '';
  }
  if (this.optional && missing(value)) return [];
  var errors = this._match(path, value);
  if (!errors) return [];
  if (typeof errors === 'string') return [{path: path, value: value, message: errors}];
  else return errors;
};

Matcher.prototype.toJSONSchema = function() {
  if (this._toJSONSchema)
    return this._toJSONSchema();
  return {};
};

module.exports = Matcher;
