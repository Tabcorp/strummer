var _       = require('lodash');
var isArray = require('isarray');
var Matcher = require('../matcher');
var factory = require('../factory');
var compile = require('../compile');

module.exports = factory({
  initialize: function(opts) {
    var matcher;
    if (typeof opts === 'string') {
      matcher = opts;
    } else if (opts instanceof Matcher) {
      matcher = opts;
    } else if (typeof opts === 'object' && opts.of) {
      matcher = opts.of;
    } else {
      throw new Error('Invalid array matcher: missing <of>');
    }
    this.of = compile.spec(matcher);
    if (opts) {
      this.min = opts.min;
      this.max = opts.max;
    }
  },

  match: function(path, value) {
    if (isArray(value) === false) {
      return [{path: path, value: value, message: 'should be an array'}];
    }

    // check number of items
    if (this.min && this.max && (value.length < this.min || value.length > this.max)) {
      return [{path: path, value: value, message: 'should have between ' + this.min + ' and ' + this.max + ' items'}];
    }
    if (this.min && value.length < this.min) {
      return [{path: path, value: value, message: 'should have at least ' + this.min + ' items'}];
    }
    if (this.max && value.length > this.max) {
      return [{path: path, value: value, message: 'should have at most ' + this.max + ' items'}];
    }

    // call the matcher on each item
    var self = this;
    return _.compact(_.flatten(_.map(value, function(val, idx) {
      return self.of.match(path + '[' + idx + ']', val, idx);
    })));
  },
  toJSONSchema: function() {
    var schema = { type: 'array' };
    schema.items = this.of.toJSONSchema();
    if (this.min) {
      schema.minItems = this.min;
    }
    if (this.max) {
      schema.maxItems = this.max;
    }
    return schema;
  }
});
