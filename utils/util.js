function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertByline(authors, locations) {
  if (!locations) {
    return authors.replace(',', ' ');
  }

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

function filterArticleData(data) {
  return {
    englishTitle: data.eheadline,
    chineseTitle: data.cheadline,
    standfirst: data.clongleadbody,
    mainImage: imageService(data.story_pic.other),
    publishDate: formatTime(new Date(data.last_publish_time * 1000)),
    byline: data.cbyline_description + ' ' + convertByline(data.cauthor, data.cbyline_status),
    cbody: data.cbody,
    ebody: data.ebody
  }
}

function stringify(obj) {
  const sep = '&';
  const eq = '=';
  const qs = [];

  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      qs.push(`${encodeURIComponent(k)}${eq}${encodeURIComponent(obj[k])}`);
    }
  }
  return qs.join(sep);
}

function imageService(url) {
  const width = 600;
  const height = Math.floor(width * 9 / 16);
  return `https://www.ft.com/__origami/service/image/v2/images/raw/${encodeURIComponent(url)}?width=${width}&height=${height}&fit=cover&source=ftchinese`;
}

module.exports = {
  formatTime: formatTime,
  convertByline: convertByline,
  zipBilingual: zipBilingual,
  filterArticleData: filterArticleData,
  stringify: stringify,
  imageService: imageService
};
