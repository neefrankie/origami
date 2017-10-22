const path = require('path');
const Share = require('../lib/index');

const share = new Share();

const basePath = path.resolve('.');
const p = path.resolve('.', 'views');
console.log(p.indexOf(basePath));