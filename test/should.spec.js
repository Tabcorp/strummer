var s = require('../lib/index');

// consumers would actually use this as
// require('strum/should')(should)
var should = require('should');
require('../should')(should);

describe('should.js integration', function() {

  it('throws a nice legible error', function() {
    var person = {
      name: 'bob',
      age: 'foo'
    };
    try {
      person.should.have.structure({
        name: 'string',
        age: 'number'
      });
    } catch(ex) {
      ex.message.should.containEql('age should be a number');
    }
  });

  it('throws all applicable errors', function() {
    var person = {
      phones: [
        { type: true,   number: 123456  },
        { type: 'home', number: 'hello' }
      ]
    };
    try {
      person.should.have.structure({
        phones: s.array({
          type: 'string',
          number: 'number'
        })
      });
    } catch(ex) {
      ex.message.should.containEql('phones[0].type should be a string');
      ex.message.should.containEql('phones[1].number should be a number');
    }
  });

});
