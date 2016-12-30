const fs = require('mz/fs');
const path = require('path');
const svg2png = require('svg2png');
const sharp = require('sharp');

/*
 * @param {String} svg - svg file's content
 * @return {Promise}
 */
function convert(svg) {
	const buffer = Buffer.from(svg);
	return sharp(buffer).toBuffer();
}
// svg2png is n times slower than sharp.
// function convert(svg) {
// 	return svg2png(Buffer.from(svg))
//  }

 module.exports = convert;