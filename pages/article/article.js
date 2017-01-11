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
      console.log(options);
      this.options = options;

      app.retrieveData(options.id, (err, data) => {
// If no error, then use cached data        
        if (!err) {
          console.log('Find cache.');
          this.setArticleData(data);

          return;
        }
// If error, no data in cache, got to fetch it and store it.
        console.log('No cache. Fetch it.');

        this.fetchAndCacheArticle();
      });
    },

    fetchAndCacheArticle: function() {
      app.fetchArticle(`https://api.ftmailbox.com/index.php/jsapi/get_story_more_info/${this.options.id}`, (data) => {
        this.setArticleData(data);

        app.storeData(this.options.id, data, (err) => {
          if (err) {return err;}
        });

      });     
    },

    setArticleData: function (data) {
      this.setData(data);

      const body = this.options.bilingual ? utils.zipBilingual(data.ebody, data.cbody) : data.cbody;
      WxParse.wxParse('body', 'html', body, this);
    },

    onPullDownRefesh: function() {
      this.fetchAndCacheArticle();
    }
});