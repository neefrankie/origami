const path = require('path');

/*
 * @param {Array} names - Array of files in a directory
 * @param {Boolean} ext - Whether you want to keep the extension in result.
 * @return {Array}
 */
function filterFiles (names, ext=true) {
  const namesKept = names.filter(name => {
    return path.extname(name) === '.svg'
  });

  if (ext) {
    return namesKept;
  }
  return namesKept.map(name => {
    return path.basename(name, '.svg');
  });
}

module.exports = filterFiles;