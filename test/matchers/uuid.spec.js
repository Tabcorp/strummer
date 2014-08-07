var uuid = require('../../lib/matchers/uuid');

describe('uuid matcher', function() {

  it('has to be a string', function() {
    uuid()('', 123).should.have.error(/should be a UUID/);
    uuid()('', false).should.have.error(/should be a UUID/);
  });

  it('has to be in the UUID format', function() {
    uuid()('', '89c34fa10be545f680a384b962f0c699').should.have.error(/should be a UUID/);
    uuid()('', '00000000-0000-1000-8000-000000000000').should.not.have.error();
    uuid()('', '3c8a90dd-11b8-47c3-a88e-67e92b097c7a').should.not.have.error();
  });

  it('requires the <version> digit to be between 1 and 5', function() {
    for (var i = 1; i <= 5; ++i) {
      uuid()('', '00000000-0000-' + i + '000-8000-000000000000').should.not.have.error();
    }
    uuid()('', '00000000-0000-0000-8000-000000000000').should.have.error(/should be a UUID/)
    uuid()('', '00000000-0000-6000-8000-000000000000').should.have.error(/should be a UUID/)
  });

  it('requires the <variant> digit to be either 8, 9, a, b', function() {
    uuid()('', '00000000-0000-4000-0000-000000000000').should.have.error(/should be a UUID/);
    uuid()('', '00000000-0000-4000-8000-000000000000').should.not.have.error();
    uuid()('', '00000000-0000-4000-9000-000000000000').should.not.have.error();
    uuid()('', '00000000-0000-4000-a000-000000000000').should.not.have.error();
    uuid()('', '00000000-0000-4000-b000-000000000000').should.not.have.error();
  });

  it('can specify the required version', function() {
    uuid({version: 3})('', 'hello').should.have.error(/should be a UUID version 3/);
    uuid({version: 3})('', '00000000-0000-4000-8000-000000000000').should.have.error(/should be a UUID version 3/);
    uuid({version: 3})('', '00000000-0000-3000-8000-000000000000').should.not.have.error();
  });

});
