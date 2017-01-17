const WxParse = require('../../wxParse/wxParse.js');
const utils = require('../../utils/util.js');
const app = getApp();
const gaBasePath = '/wx/story';

Page({
    data: {
      title: '',
      standfirst: '',
      mainImage: '',
      publishDate: '',
      byline: '',
      body: ''
    },
    
    onLoad: function(options) {
// `options` to be used by other methods.
      this.options = options;

      app.retrieveData(options.id, (err, data) => {
// If no error, then use cached data        
        if (!err) {
          this.setArticleData(data);

// Tracking
          this.sendTracking(data.chineseTitle);
          return;
        }
// If error, no data in cache, got to fetch it and store it.
        this.fetchAndCacheData();
      });
    },

// On pull down, request data from server
    onPullDownRefesh: function() {
      this.fetchAndCacheData(wx.stopPullDownRefresh);
    },

    onShareAppMessage: function() {
      const basePath = '/pages/article/article';
      return {
        title: `${this.data.chineseTitle} - FT中文网`,
        desc: this.options.bilingual ? 'FT双语阅读' : 'FT今日焦点',
        path: `/pages/article/article?${utils.stringify(this.options)}`
      }
    },
/**
  * The following are methods specific to this page.
  */ 
    fetchAndCacheData: function() {
      app.fetchData(`https://api.ftmailbox.com/index.php/jsapi/get_story_more_info/${this.options.id}`, (err, data) => {
        if (err) { return err;}

        const articleData = utils.filterArticleData(data);

        this.setArticleData(articleData);

// Cache the filtered data, not requested data.
        app.cacheData(this.options.id, articleData);

// Tracking
        this.sendTracking(articleData.chineseTitle);

      });        
    },

/*
 * @param {Object} data - data from cache or server 
 */
    setArticleData: function (data) {
      this.setData(data);

// Tell the view whether it is used for bilingual story      
      this.setData({
        isBilingual: this.options.bilingual
      });

      const body = this.options.bilingual ? utils.zipBilingual(data.ebody, data.cbody) : data.cbody;
      WxParse.wxParse('body', 'html', body, this);
    },

/**
 * @param {String} title - current aritcle's title
 */
    sendTracking: function(title) {
// For chinese text page, use `/wx/story/<id>`
// For binlingual text page, use `/wx/story/<id>/ce`      
      const documentPath = this.options.bilingual ? `${gaBasePath}/${this.options.id}/ce` : `${gaBasePath}/${this.options.id}`;

      app.ga(documentPath, title);
    }
});