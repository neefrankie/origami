function formatTime(date) {
  var year = date.getFullYear() + '年';
  var month = date.getMonth() + 1 + '月';
  var day = date.getDate() + '日';

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
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

/**
 * @return {Object}
 */
function filterArticleData(data) {
  const pic = data.story_pic;
  const imageUrl = pic.cover ? pic.cover : pic.other;
  const desc = data.cbyline_description 
    ? data.cbyline_description : '';
  const author = data.cauthor ? data.cauthor : '';

  return {
    englishTitle: data.eheadline,
    chineseTitle: data.cheadline,
    standfirst: data.clongleadbody,
    mainImage: imageService(imageUrl),
    publishDate: '更新于' + formatTime(new Date(data.last_publish_time * 1000)),
    byline: desc + ' ' + author,
    cbody: data.cbody,
    ebody: data.ebody
  }
}

function imageService(url) {
  const width = 600;
  const height = Math.floor(width * 9 / 16);
  return `https://www.ft.com/__origami/service/image/v2/images/raw/${encodeURIComponent(url)}?width=${width}&height=${height}&fit=cover&source=ftchinese`;
}

module.exports = {
  formatTime: formatTime,
  filterArticleData: filterArticleData,
  imageService: imageService,
  zipBilingual: zipBilingual
}
