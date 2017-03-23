const getFooterData = require('../lib');

console.log(getFooterData());
console.log(getFooterData({type: 'simple'}));
console.log(getFooterData({type: 'wrong'}));