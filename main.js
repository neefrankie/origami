const ftcShare = require('./src/js/share');
console.log(ftcShare.constructor);
document.addEventListener('DOMContentLoaded', function() {
  var shareDiv = document.querySelectorAll('.share-links');
 
  for (var i = 0; i < shareDiv.length; i++) {
  	var shareLinks = Object.create(ftcShare);
    shareLinks.init(shareDiv[i]);
    console.log(shareLinks);
  }
   
});

function Test() {
	var oTest = this;
	oTest.rootEl = 'body';
}

var test = new Test();
console.log(test);

module.exports = ftcShare;