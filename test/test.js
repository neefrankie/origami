const path = require('path');
const Share = require('../lib/index');

const share = new Share(['wechat', 'weibo']);

share.buildPartial('.tmp/o-share.html')
  .catch(err => {
    console.log(err);
  });
share.buildBundle('.tmp/o-share-bundle.html')
  .catch(err => {
    console.log(err);
  });
