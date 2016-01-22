var socialShare = require('../main.js');


socialShare.build('.o-share');
/*socialShare.buildAll();*/

const rootEl = document.querySelector('.o-share');
const actionEl = document.querySelector('.o-share__action');

console.log(typeof rootEl);
rootEl.contains(actionEl);