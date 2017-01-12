const WxParse = require('../../wxParse/wxParse.js');
const utils = require('../../utils/util.js');
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
      this.options = options;

      app.retrieveData(options.id, (err, data) => {
// If no error, then use cached data        
        if (!err) {
          console.log(`Find cache for article ${options.id}`);
          console.log(data);
          this.setArticleData(data);

// Need the retrieved data's title field to set tracking info.
          this.sendTracking(data.chineseTitle);

          return;
        }
// If error, no data in cache, got to fetch it and store it.
        console.log(`No cache for article ${options.id}. Fetch it.`);

        this.fetchAndCacheData();
      });
    },

// Custom methods
    fetchAndCacheData: function() {
      app.fetchData(`https://api.ftmailbox.com/index.php/jsapi/get_story_more_info/${this.options.id}`, (err, data) => {
        if (err) { return err;}

        const articleData = utils.filterArticleData(data);
        console.log(articleData);
        this.setArticleData(articleData);

// Cache the filtered data, not requested data.
        app.cacheData(this.options.id, articleData);

// Need the requested data's title field
        this.sendTracking(articleData.chineseTitle);

      });        
    },

    setArticleData: function (data) {
      this.setData(data);

      const body = this.options.bilingual ? utils.zipBilingual(data.ebody, data.cbody) : data.cbody;
      WxParse.wxParse('body', 'html', body, this);
    },

    sendTracking: function(title) {
      const documentPath = this.options.bilingual ? `/story/${this.options.id}/ce` : `/story/${this.options.id}`;

      app.ga(documentPath, title);
    },

    onPullDownRefesh: function() {
      this.fetchAndCacheArticle();
    }
});