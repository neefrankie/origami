function getSocials({url='{{share.url}}', title='{{share.title}}', summary='{{share.summary}}', links=[], encode=true} = {}) {
  if (encode) {
    url = encodeURIComponent(url);
    title = encodeURIComponent(title);
    summary = encodeURIComponent(summary);
  }
  return [
    {
        name: "wechat",
        text: "微信",
        url: `http://www.ftchinese.com/m/corp/qrshare.html?title=${title}&url=${url}&ccode=2C1A1408`
    },
    {name: "weibo",
        text: "微博",
        url: `http://service.weibo.com/share/share.php?&appkey=4221537403&url=${url}&title=【${title}】${summary}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005`
    },
    {
        name: "linkedin",
        text: "领英",
        url: `http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}&source=FT中文网`
    },
    {
        name: "facebook",
        text: "Facebook",
        url: `http://www.facebook.com/sharer.php?u=${url}`
    },
    {
        name: "twitter",
        text: "Twitter",
        url: `https://twitter.com/intent/tweet?url=${url}&amp;text=【${title}】${summary}&amp;via=FTChinese`
    }
  ].filter(social => {
    return links.indexOf(social.name) > -1
  });
}

export default getSocials;
