const WxParse = require('../../wxParse/wxParse.js');
const utils = require('../../utils/util.js');
const gaBasePath = '/wx/life-style';
const app = getApp();

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
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 10000,
      });

      this.options = options;

      app.retrieveData(options.id, (err, data) => {
// If no error, then use cached data        
        if (!err) {
          this.setArticleData(data);
          wx.hideToast();
// Tracking
          this.sendTracking(data.title);
          return;
        }
// If error, no data in cache, got to fetch it and store it.
        this.fetchAndCacheData(wx.hideToast);
      });
    },

// On pull down, request data from server
    onPullDownRefesh: function() {
      this.fetchAndCacheData(wx.stopPullDownRefresh);
    },

    onShareAppMessage: function() {
      return {
        title: `${this.data.title} - FT中文网`,
        desc: 'FT生活时尚',
        path: `/pages/article/article?id=${this.options.id}`
      }
    },
/**
  * The following are methods specific to this page.
  */ 
    fetchAndCacheData: function(cb) {
      app.fetchData(`https://api.ftmailbox.com/index.php/jsapi/get_story_more_info/${this.options.id}`, (err, data) => {
        if (err) { return err;}

        const articleData = utils.filterArticleData(data);

        this.setArticleData(articleData);

        typeof cb == 'function' && cb();
// Cache the filtered data, not requested data.
        app.cacheData(this.options.id, articleData);

// Tracking
        this.sendTracking(articleData.title);

      });        
    },

/*
 * @param {Object} data - data from cache or server 
 */
    setArticleData: function (data) {
      this.setData(data);

// Tell the view whether it is used for bilingual story      
      WxParse.wxParse('body', 'html', data.cbody, this);
    },

/**
 * @param {String} title - current aritcle's title
 */
    sendTracking: function(title) {
// For chinese text page, use `/wx/story/<id>`     
      const documentPath = `${gaBasePath}/${this.options.id}`;

      app.ga(documentPath, title);
    }
});