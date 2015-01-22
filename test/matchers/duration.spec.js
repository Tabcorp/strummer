var duration = require('../../lib/matchers/duration');

describe('duration matcher', function() {

  it('matches durations', function() {
    duration()('', '1s').should.not.have.error();
    duration()('', '10m').should.not.have.error();
    duration()('', '3h').should.not.have.error();
  });

  it('fails for other types', function() {
    duration()('', null).should.have.error(/should be a duration/);
    duration()('', 50).should.have.error(/should be a duration/);
    duration()('', 'a long time').should.have.error(/should be a duration/);
  });

  it('can specify a min duration', function() {
    duration({min: '1m'})('', '10s').should.have.error(/should be a duration >= 1m/);
    duration({min: '1m'})('', '3m').should.not.have.error();
  });

  it('can specify a max duration', function() {
    duration({max: '1m'})('', '10s').should.not.have.error();
    duration({max: '1m'})('', '3m').should.have.error(/should be a duration <= 1m/);
  });

  it('can specify a min and max duration', function() {
    duration({min: '1s', max: '1m'})('', '10s').should.not.have.error();
    duration({min: '1s', max: '1m'})('', '3m').should.have.error(/should be a duration between 1s and 1m/);
  });

  it('only accepts valid min durations', function() {
    (function() {
      duration({min: 10});
    }).should.throw('Invalid minimum duration: 10');
    (function() {
      duration({min: 'Foo'});
    }).should.throw('Invalid minimum duration: Foo');
  });

  it('only accepts valid max durations', function() {
    (function() {
      duration({max: 20});
    }).should.throw('Invalid maximum duration: 20');
    (function() {
      duration({max: 'Bar'});
    }).should.throw('Invalid maximum duration: Bar');
  });

});
