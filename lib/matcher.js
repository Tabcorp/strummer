var _ = require('lodash');
var PROPERTY_TO_FLAG_AS_STRUMMER_MATCHER = 'IS-STRUMMER-MATCHER';

function Matcher(opts) {
  this.optional = opts && (opts.optional === true);
  this.coerce = opts && opts.coerce == false ? false : true;
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

Matcher.prototype.setName = function(name) {
  this.name = name;
};

Matcher.prototype.match = function(path, value, index) {
  if (arguments.length === 1) {
    value = path;
    path = '';
  }
  if (this.optional && missing(value)) { return []; }
  var errors = this._match(path, value, index);
  if (!errors) { return []; }
  if (typeof errors === 'string') { return [{path: path, value: value, message: errors}]; }
  else { return errors; }
};

Matcher.prototype.safeParse = function (path, value, index) {
  if (arguments.length === 1) {
    value = path;
    path = '';
  }

  if (!this._safeParse || this.coerce === false) {
    // Fallback to match and wrap result.
    var result = this.match(path, value, index);
    return result && Array.isArray(result) && result.length ?
      { errors: result } :
      { errors: [], value };
  }

  if (this.optional && missing(value)) { return { value, errors: [] }; }

  return this._safeParse(path, value, index);
}

Matcher.prototype.toJSONSchema = function() {
  var basic = {};
  var generated = {};

  if (this.name) {
    basic.name = this.name;
  }

  if (this._toJSONSchema) {
    generated = this._toJSONSchema();
  }

  return _.assign({}, basic, generated);
};

module.exports = Matcher;
