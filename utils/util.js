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

function filterArticleData(data) {
  const pic = data.story_pic;
  const imageUrl = pic.cover ? pic.cover : pic.other;
  return {
    title: data.cheadline,
    standfirst: data.clongleadbody,
    mainImage: imageService(imageUrl),
    publishDate: formatTime(new Date(data.last_publish_time * 1000)),
    byline: data.cbyline_description + ' ' + data.cauthor,
    cbody: data.cbody
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
  imageService: imageService
}
