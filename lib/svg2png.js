const fs = require('mz/fs');
const path = require('path');
const sharp = require('sharp');

/*
 * @param {String} svg - svg file's content
 * @return {Promise}
 */
function svg2png(svg) {
	const buffer = Buffer.from(svg);
	return sharp(buffer).toBuffer();
}

 module.exports = svg2png;