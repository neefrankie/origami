const mkdirp = require('mkdirp');

function mkdir(dir, opts) {
	return new Promise((resolve, reject) => {
		mkdirp(dir, opts, (err, made) => {
			err === null ? resolve(made) : reject(err);
		});
	});
}

module.exports = mkdir;