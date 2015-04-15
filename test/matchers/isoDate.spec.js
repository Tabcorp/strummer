var date = require('../../lib/matchers/isoDate');

describe('iso date matcher', function() {

  it('matches full ISO8601 date format', function() {
    date()('', '1000-00-00T00:00:00.000Z').should.not.have.error();
    date()('', '2999-12-31T23:59:59.999Z').should.not.have.error();
  });

  it('supports optional GMT sign', function() {
    date()('', '2999-12-31T23:59:59.999').should.not.have.error();
  });

  it('supports optional milliseconds', function() {
    date()('', '2999-12-31T23:59:59').should.not.have.error();
  });

  it('does not match other date strings', function() {
    date()('', '31-12-2014').should.have.error(/should be a date with time in ISO8601 format/);
    date()('', '2014-12-31 23:59').should.have.error(/should be a date with time in ISO8601 format/);
  });

  it('does not match values that are not strings', function() {
    date()('', 20141231).should.have.error(/should be a date in ISO8601 format/);
    date()('', null).should.have.error(/should be a date in ISO8601 format/);
  });

  it("matches just the date if that's all is requested", function() {
    date({time: false})('', '2999-12-31').should.not.have.error();
  });

  it("does not match invalid dates when the time is not required", function() {
    date({time: false})('', '2999/12/31').should.have.error(/should be a date in ISO8601 format/);
  });

  it('respects the time flag if explicitly used', function() {
    date({time: true})('', '2999-12-31').should.have.error(/should be a date with time in ISO8601 format/);
  });
});
