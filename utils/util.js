function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertByline(authors, locations) {
  if (locations.indexOf(',') === -1) {
    return authors.replace(',', ' ') + ' ' + locations;
  }
  const authorArr = authors.split(',');
  const locationArr = locations.split(',');
  const lengthDiff = authorArr.length - locationArr.length
  if (lengthDiff > 0) {
    for (let i = 0; i < lengthDiff; i++) {
      locationArr.unshift('');
    }
  }

  return authorArr.map((item,index) => {
    return item + ' ' + locationArr[index];
  }).join(', ');
}

function zipBilingual(en, cn) {
  const bilingual = [];
  const separator = /\r\n|\r|\n/;
  const cnArr = cn.split(separator);
  const enArr = en.split(separator);

  const maxLength = Math.max(cnArr.length, enArr.length);

  console.log(maxLength);

  for (let i = 0; i < maxLength; i++) {
    if (!enArr[i]) {
      enArr[i] = '';
    }

    if (!cnArr[i]) {
      cnArr[i] = '';
    }

    bilingual[i] = enArr[i] + cnArr[i];
  }
  return bilingual.join('');
}

module.exports = {
  formatTime: formatTime,
  convertByline: convertByline,
  zipBilingual: zipBilingual
}
