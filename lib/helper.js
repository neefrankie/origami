const fs = require('fs');
const path = require('path');
const junk = require('junk')
const nunjucks = require('nunjucks');
const cheerio = require('cheerio');

var env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(
    [process.cwd(), path.resolve(process.cwd(), 'demos/src')],
    {noCache: true}
  ),
  {autoescape: false}
);

function render(template, context, destName) {
  return new Promise(function(resolve, reject) {
    env.render(template, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve({
          name: destName,
          content: result
        });
      }
    });
  });
}

function readJson(filename) {
  return new Promise(
    function(resolve, reject) {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
          console.log('Cannot find file: ' + filename);
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    }
  );
}

function readFile(filename) {
  return new Promise(
    function(resolve, reject) {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
          console.log('Cannot find file: ' + filename);
          reject(err);
        } else {
          resolve({
            path: filename,
            content: data
          });
        }
      });
    }
  );
}

function readDir(filepath) {
  return new Promise(function(resolve, reject) {
    fs.readdir(filepath, 'utf8', function(err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files.filter(junk.not).map(file => path.join(filepath, file)));
      }
    });
  });
}

// transpose columns and rows of 2D array.
function zip(matrix) {
  const arr = [];

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
// At first `arr` is one dimensional array.
// If `j`th element of `arr` is not an array, set it to an empty array.
// Then push current elemtn of `row` into the `j`th element.
// 1, 2, 3, 4, 5
// a, b, c, d, e
// 一, 二, 三, 四, 五
// will be
// 1, a, 一
// 2, b, 二
// 3, c, 三
// 4, d, 四
// 5, e, 五
      if (!Array.isArray(arr[j])) {
        arr[j] = [];
      }
      arr[j].push(row[j]);
    }
  }
  return arr;
}

function transformSvg(svg, data) {
	data.rx = data.rx ? data.rx : null;
	data.ry = data.ry ? data.ry : null;

  $ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });

	var foregroundEl = $('.foreground');
	var backgroundEl = $('.background');

	if (data.foreground) {
    if (foregroundEl.length) {
      foregroundEl.attr('fill', data.foreground).attr('class', null);
    }
  }

  if (data.background) {
    $('.background').attr('fill', data.background).attr('rx', data.rx).attr('ry', data.ry);
  } else {
    $('.background').remove();
  }

	if (data.background) {
    if (backgroundEl.length) {
      backgroundEl
				.attr('fill', data.background)
				.attr('rx', data.rx)
				.attr('ry', data.ry)
				.attr('class', null);
    } else {
			var styles = `fill="${data.background}"`;
			if (data.rx) {
				styles += ` rx=${data.rx}`;
			}
			if (data.ry) {
				styles += ` ry=${data.ry}`;
			}
      const rectEl = `<rect width="100%" height="100%" ${styles}/>`
      $('svg').prepend(rectEl);
    }
  }

  return $.html();
}

module.exports = {
  readJson: readJson,
  readFile: readFile,
  readDir: readDir,
  render: render,
  zip: zip,
  transformSvg: transformSvg
};
