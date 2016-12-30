const fs = require('mz/fs');
const path = require('path');
const settings = require('../src/js/settings.json');
const dest = path.resolve(process.cwd(), 'demos/src/image-list.scss');

const images = settings.map(setting => {
  return `'${setting.name}'`;
}).join('\n\t');

const sass = `$image-list: (\n\t${images}\n);`;

fs.writeFile(dest, sass, 'utf8')
  .catch(err => {
    console.log(err);
  });