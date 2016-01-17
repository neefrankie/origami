var socialShare = require('../main.js');


socialShare.build('.o-share');
socialShare.buildAll();

const actionEl = document.querySelector('.o-share__action');
console.log(actionEl.textContent);