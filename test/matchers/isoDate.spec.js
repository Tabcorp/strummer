var date = require('../../lib/matchers/isoDate');

describe('iso date matcher', function() {

  it('matches full ISO8601 date format', function() {
    new date().match('', '1000-00-00T00:00:00.000Z').should.not.have.error();
    new date().match('', '2999-12-31T23:59:59.999Z').should.not.have.error();
    new date().match('', '1000-00-00T00:00:00.000+00:00').should.not.have.error();
    new date().match('', '2999-12-31T23:59:59.999-00:00').should.not.have.error();
    new date().match('', '1000-00-00T00:00:00.000+10:24').should.not.have.error();
    new date().match('', '2999-12-31T23:59:59.999-01:28').should.not.have.error();
    new date().match('', '2999-12-31T23:59:59.9999-01:28').should.not.have.error();
  });

  it('supports optional GMT sign', function() {
    new date().match('', '2999-12-31T23:59:59.999').should.not.have.error();
  });

  it('supports optional seconds', function() {
    new date().match('', '2999-12-31T23:59').should.not.have.error();
  });

  it('supports optional milliseconds', function() {
    new date().match('', '2999-12-31T23:59:59').should.not.have.error();
  });

  it('does not match other date strings', function() {
    new date().match('', '31-12-2014').should.have.error(/should be a date with time in ISO8601 format/);
    new date().match('', '2014-12-31 23:59').should.have.error(/should be a date with time in ISO8601 format/);
  });

  it('does not match values that are not strings', function() {
    new date().match('', 20141231).should.have.error(/should be a date in ISO8601 format/);
    new date().match('', null).should.have.error(/should be a date in ISO8601 format/);
  });

  it("matches just the date if that's all is requested", function() {
    new date({time: false}).match('', '2999-12-31').should.not.have.error();
  });

  it("does not match invalid dates when the time is not required", function() {
    new date({time: false}).match('', '2999/12/31').should.have.error(/should be a date in ISO8601 format/);
  });

  it('respects the time flag if explicitly used', function() {
    new date({time: true}).match('', '2999-12-31').should.have.error(/should be a date with time in ISO8601 format/);
  });

  it('generates json schema with specific format', function() {
    new date().toJSONSchema().should.eql({
      type: 'string',
      format: 'ISO8601'
    });
  });

  it('generates json schema with specific format', function() {
    new date({ description: 'Lorem ipsum' }).toJSONSchema().should.eql({
      type: 'string',
      format: 'ISO8601',
      description: 'Lorem ipsum'
    });
  });
});
