var duration = require('../../lib/matchers/duration');

describe('duration matcher', function() {

  it('matches durations', function() {
    new duration().match('', '1s').should.not.have.error();
    new duration().match('', '10m').should.not.have.error();
    new duration().match('', '3h').should.not.have.error();
  });

  it('fails for other types', function() {
    new duration().match('', null).should.have.error(/should be a duration/);
    new duration().match('', 50).should.have.error(/should be a duration/);
    new duration().match('', 'a long time').should.have.error(/should be a duration/);
  });

  it('can specify a min duration', function() {
    new duration({min: '1m'}).match('', '10s').should.have.error(/should be a duration >= 1m/);
    new duration({min: '1m'}).match('', '3m').should.not.have.error();
  });

  it('can specify a max duration', function() {
    new duration({max: '1m'}).match('', '10s').should.not.have.error();
    new duration({max: '1m'}).match('', '3m').should.have.error(/should be a duration <= 1m/);
  });

  it('can specify a min and max duration', function() {
    new duration({min: '1s', max: '1m'}).match('', '10s').should.not.have.error();
    new duration({min: '1s', max: '1m'}).match('', '3m').should.have.error(/should be a duration between 1s and 1m/);
  });

  it('only accepts valid min durations', function() {
    (function() {
      new duration({min: 10});
    }).should.throw('Invalid minimum duration: 10');
    (function() {
      new duration({min: 'Foo'});
    }).should.throw('Invalid minimum duration: Foo');
  });

  it('only accepts valid max durations', function() {
    (function() {
      new duration({max: 20});
    }).should.throw('Invalid maximum duration: 20');
    (function() {
      new duration({max: 'Bar'});
    }).should.throw('Invalid maximum duration: Bar');
  });

  it('generates a string schema with ms pattern', function() {
    var d = new duration().toJSONSchema();
    var reg = new RegExp(d.pattern, 'i');
    d.type.should.equal('string');
    reg.test('2 days').should.be.true;
    reg.test('1s').should.be.true;
  });

  it('generates a string schema with optional description', function() {
    var d = new duration({ description: 'Lorem ipsum' }).toJSONSchema();
    d.type.should.equal('string');
    d.description.should.equal('Lorem ipsum');
  });

  it('parses a valid duration', function() {
    var d = new duration({ description: 'Lorem ipsum' });
    d.safeParse('10s').should.eql({ value: '10s', errors: [] });
  });

  it('parses an invalid duration', function() {
    var d = new duration({ description: 'Lorem ipsum' });
    d.safeParse('xyz').should.eql({ errors: [{path: '', message: 'should be a duration string (e.g. "10s")', value: 'xyz'}] });
  });
});
