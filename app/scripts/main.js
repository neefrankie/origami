require(['share'], function(Share) {
	console.log(Share);
  var shareDiv = document.querySelectorAll('.share-links');
  var shareLinks = Object.create(Share);
  for (var i = 0; i < shareDiv.length; i++) {
    shareLinks.init(shareDiv[i]);
  }
});