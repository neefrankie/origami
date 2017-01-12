// pages/bilingual/bilingual.js
const utils = require('../../utils/util.js');
//获取应用实例
var app = getApp();

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    app.checkNetwork((err, type) => {
      // If wifi connection, always request to server
      this.fetchAndCacheData();

    }, (err, type) => {
      // If data connection, try to get data from cache first. If failed, then asking server for data.
      app.retrieveData('articleList', (err, data) => {
        // If there is no error, data is retrieved from cache
        if (!err) {
          console.log('article list retrieved from cache');
          this.setData({
            articleList: data
          });
// Tracking
          app.ga('/channel/ce.html', '双语阅读');
          return;
        }

        // If there is error, request data to server
        this.fetchAndCacheData();
      });
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  fetchAndCacheData: function() {
    app.fetchData('https://api.ftmailbox.com/index.php/jsapi/sod', (err, data) => {
      if (err) {return err;}
      // Get bilingual reading's article list.

      this.setData({
        articleList: data
      });
      console.log(data);

      // Cache data. Use a different key than the `articleList`
      app.cacheData('bilingualList', data, (err, key) => {
        if (err) {
          console.log('Cache bilingual list failed.');
          return;
        }
      });

      // Cache individual article
      data.map(entry => {
        console.log(`Caching article: ${entry.id}`);
        app.cacheData(entry.id, utils.filterArticleData(entry));
      });

      app.ga('/channel/ce.html', '双语阅读');
    });
  }

})