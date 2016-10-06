const promisify = require('promisify-node')
const fs = promisify('fs');
const path = require('path');
const junk = require('junk')
const source = path.resolve(process.cwd(), 'static/svg');
const dest = path.resolve(process.cwd(), 'demos/src/social-list.scss');

fs.readdir(source)
  .then(files => {
    return files
      .filter(junk.not)
      .map(file => {
        return path.basename(file, '.svg');
      });
  }, e => {
    console.error(e.stack);
  })
  .then(files => {
    return files.map(file => {
      return `'${file}'`;
    }).join();
  })
  .then(string => {
    return `$social-list: (${string})`;
  })
  .then(list => {
    return fs.writeFile(dest, list, 'utf8');
  })
  .then(null, e => {
    console.error(e.stack);
  });

// const scssList = `$social-list: (${listString})`;
//
// fs.writeFile(dest, scssList, 'utf8', (e) => {
//   if (e) throw e;
// });
