var Table  = require('cli-table');
var format = require('format-number');
var s = require('../lib/strummer');

describe('Performance', function() {

  this.slow(1000);
  this.timeout(2000);

  var schema = new s.object({
    id: new s.uuid({version: 4}),
    name: 'string',
    age: new s.number({optional: true, min: 1, max: 100}),
    addresses: new s.array({of: {
      type: 'string',
      city: 'string',
      postcode: 'number'
    }}),
    nicknames: [{max: 3, of: 'string'}],
    phones: [{of: {
      type: new s.enum({values: ['MOBILE', 'HOME']}),
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
    verifyResults();
    var table = new Table({head: ['Number of validations', 'Total time (ms)']});
    run(table, 100);
    run(table, 1000);
    run(table, 10000);
    console.error('\n' + table.toString() + '\n');
  });

  function run(table, count) {
    var start = new Date();
    for (var i = 0; i < count; ++i) {
      var errors = schema.match('', invalidObject);
    }
    var end = new Date();
    table.push([format()(count), end-start]);
  }

  function verifyResults() {
    var errors = schema.match('', invalidObject);
    errors.should.eql(
      [{
        path: 'addresses[1].postcode',
        value: undefined,
        message: 'should be a number'
      }, {
        path: 'nicknames[2]',
        value: false,
        message: 'should be a string'
      }, {
        path: 'phones[2].type',
        value: 'OTHER',
        message: 'should be a valid enum value'
      }]
    );
  }

});
