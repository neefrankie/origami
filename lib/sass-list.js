const fs = require('fs-jetpack');
const path = require('path');
const settings = require('../src/js/settings.json');
const dest = path.resolve(__dirname, '../demos/src/image-list.scss');

const images = settings.map(setting => {
  return `'${setting.name}'`;
}).join('\n\t');

const sass = `$image-list: (\n\t${images}\n);`;

fs.writeAsync(dest, sass)
  .catch(err => {
    console.log(err);
  });