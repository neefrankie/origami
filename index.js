const path = require('path');
const fs = require('fs-jetpack');
const Share = require('./lib/share.node.js');
const jsdom = require('jsdom');

/*
 * @param {Object} config - optional
 * @param {String} config.outDir - output directory.
 * @param {Array} config.links - social paltforms name.
 */
function createPartials(config = {
  url: '{{share.url}}', 
  title:'{{share.title}}', 
  summary:'{{share.summary}}'
}) {
  return new Promise(function(resolve, reject) {
    jsdom.env("<html><body></body></html>", function(err, window) {
      if (err) reject(err);
      new Share(window.document.body, config);
      resolve(String(body.html()));
	  });
  });
}

if (require.main === module) {
  createPartials()
    .then(html => {
      fs.writeAsync('share.html', html);
    });
}

// module.exports = share;