const WxParse = require('../../wxParse/wxParse.js');
const utils = require('../../utils/util.js');
const gaBasePath = '/wx/story';
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
      this.options = options;

      app.retrieveData(options.id, (err, data) => {
// If no error, then use cached data        
        if (!err) {
          this.setArticleData(data);

// Tracking
          this.sendTracking(data.title);
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
        title: `${this.data.title} - FT中文网`,
        desc: 'FT生活时尚',
        path: `/pages/article/article?id=${this.options.id}`
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