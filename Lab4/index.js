const Operation = require('./module.js');

console.log('Sum of ' +process.argv[2]+ ' and '+process.argv[3]+' = '+(new Operation(Number(process.argv[2]), Number(process.argv[3])).sum()));
