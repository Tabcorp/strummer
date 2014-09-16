var Table  = require('cli-table');
var format = require('format-number');
var s      = require('../lib/s');

describe('Performance', function() {

  var schema = s({
    id: s.uuid({version: 4}),
    name: 'string',
    age: s.optional(s.number({min: 1, max: 100})),
    addresses: s.array({of: {
      type: 'string',
      city: 'string',
      postcode: 'number'
    }}),
    nicknames: [{max: 3, of: 'string'}],
    phones: [{of: {
      type: s.enum({values: ['MOBILE', 'HOME']}),
      number: /^[0-9]{10}$/
    }}]
  });

  var invalidObject = {
    id: '3c8a90dd-11b8-47c3-a88e-67e92b097c7a',
    name: 'John Doe',
    age: 30,
    addresses: [{
      type: 'billing',
      city: 'Sydney',
      postcode: 2000
    },{
      type: 'delivery',
      city: 'New York'
    }],
    nicknames: ['Jon', 'Johnny', false],
    phones: [
      { type: 'HOME',   number: '0233334444' },
      { type: 'MOBILE', number: '0455556666' },
      { type: 'OTHER',  number: '0000000000' }
    ]
  };

  it('generates stats for the README', function() {
    var table = new Table({head: ['Number of validations', 'Total time (ms)']});
    run(table, 100);
    run(table, 1000);
    run(table, 10000);
    console.log('\n' + table.toString() + '\n');
  });

  function run(table, count) {
    var start = new Date();
    for (var i = 0; i < count; ++i) {
      var errors = schema(invalidObject);
      errors.should.have.length(3);
    }
    var end = new Date();
    table.push([format()(count), end-start]);
  }

});
