var escapeStringRegexp  = require('escape-string-regexp');
var utils               = require('../utils');
var factory             = require('../factory');

var TYPE_ERROR = 'should be a valid email address';

var DOMAIN_REGEX_SOURCE = /[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+/.source;
var DOMAIN_REGEX = new RegExp('^' + DOMAIN_REGEX_SOURCE + '$');
var EMAIL_REGEX_SOURCE = /[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@/.source;
var EMAIL_REGEX = new RegExp('^' + EMAIL_REGEX_SOURCE + DOMAIN_REGEX_SOURCE + '$');

// Stolen from http://thedailywtf.com/articles/Validating_Email_Addresses

module.exports = factory({
  initialize: function(opts) {
    this.opts = opts || {};

    this.hasDomain = utils.hasValue(this.opts.domain);
    this.description = this.opts.description;

    if (this.hasDomain && !DOMAIN_REGEX.test(opts.domain)) {
      throw new Error('Invalid domain value: ' + opts.domain);
    }

    if (this.hasDomain) {
      this.domainRegex = this.regex = new RegExp('^' + EMAIL_REGEX_SOURCE + escapeStringRegexp(opts.domain) + '$');
    } else {
      this.regex = EMAIL_REGEX;
    }
  },

  match: function(path, value) {
    if (typeof value !== 'string') { return TYPE_ERROR; }

    if (value.length > 254) { return TYPE_ERROR; }

    if (!EMAIL_REGEX.test(value)) { return TYPE_ERROR; }

    if (this.hasDomain && !this.domainRegex.test(value)) {
      return 'should be a valid email address at ' + this.opts.domain;
    }

    // Further checking of some things regex can't handle
    var parts = value.split('@');
    if (parts[0].length > 64) { return TYPE_ERROR; }

    var longPartOfDomain = parts[1].split('.').some(function(part) {
      return part.length > 63;
    });
    if (longPartOfDomain) { return TYPE_ERROR; }

    return null;
  },

  toJSONSchema: function () {
    var schema = {
      type: 'string',
      pattern: this.regex.source
    }
    if (this.description) {
      schema.description = this.description;
    }
    return schema;
  }
});
