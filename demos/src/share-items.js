function shareItems (config) {
  for (k in config) {
    if (config.hasOwnProperty(k)) {
      config[k] = encodeURIComponent(config[k]);
    }
  }
  
  return {
    theme: "theme-default",
    items: [
      {
        name: "wechat",
        text: "微信",
        url: `http://www.ftchinese.com/m/corp/qrshare.html?title=${config.title}&url=${config.url}&ccode=2C1A1408`
      },
      {
        name: "weibo",
        text: "微博",
        url: `http://service.weibo.com/share/share.php?&appkey=4221537403&url=${config.url}&title=【${config.title}】${config.summary}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005`
      },
      {
        name: "linkedin",
        text: "领英",
        url: `http://www.linkedin.com/shareArticle?mini=true&url=${config.url}&title=${config.title}&summary=${config.summary}&source=FT中文网`
      },
      {
        name: "facebook",
        text: "Facebook",
        url: `http://www.facebook.com/sharer.php?u=${config.url}`
      },
      {
        name: "twitter",
        text: "Twitter",
        url: `https://twitter.com/intent/tweet?url=${config.url}&amp;text=【${config.title}】{{summary}}&amp;via=FTChinese`
      }
    ],
    useSvgSymbol: false
  };
}

module.exports = shareItems;
