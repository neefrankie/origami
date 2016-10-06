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
      if (arr[j] && Array.isArray(arr[j])) {
        arr[j].push(row[j]);
      } else {
        arr[j] = [];
      }
    }
  }
  return arr;
}

function transformSvg(svg, data) {
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
    if (backgroundEl.length) {
      backgroundEl.attr('fill', data.background).attr('class', null);
    } else {
      const rectEl = `<rect width="100%" height="100%" fill="${data.background}"/>`
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
