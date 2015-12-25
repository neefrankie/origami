const ftcShare = require('./src/js/share');

document.addEventListener('DOMContentLoaded', function() {
  var shareDiv = document.querySelectorAll('.share-links');
  var shareLinks = Object.create(ftcShare);
  for (var i = 0; i < shareDiv.length; i++) {
    shareLinks.init(shareDiv[i]);
  }  
});

module.exports = ftcShare;