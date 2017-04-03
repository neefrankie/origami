function buildUrl({name, size, format, tint=null}) {
  let url =  `https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Finteractive.ftchinese.com%2Flogo-images%2F${name}.svg?source=ftchinese&height=${size}&format=${format}`;
  if (tint) {
    tint = `&tint=${tint.replace(/#/g, '%23')}`;
  }
  url += tint;
  return url;
}

if (require.main === module) {
  const url = buildUrl({
    name: 'brand-ftc-masthead',
    size: 100,
    format: 'png',
    tint: '#D75893'
  });
  console.log(url);
}

module.exports = buildUrl;