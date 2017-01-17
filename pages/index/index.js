// pages/bilingual/bilingual.js
const utils = require('../../utils/util.js');
const gaPath = '/wx/bilingual-reading'
const gaTitle = '双语阅读';
//获取应用实例
var app = getApp();

Page({
  data:{},
  onLoad:function(){
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1500,
    });

    app.checkNetwork((err, type) => {
// If wifi connection, always request to server
      this.fetchAndCacheData(wx.hideToast);

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
          app.ga(gaPath, gaTitle);
          return;
        }

// If there is error, request data to server
        this.fetchAndCacheData(wx.hideToast);

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

  onPullDownRefresh: function() {
// Manually request data
    this.fetchAndCacheData(wx.stopPullDownRefresh);
  },

  onShareAppMessage: function() {
    return {
      title: 'FT双语阅读',
      desc: 'FT中文网双语阅读',
      path: '/pages/bilingual/bilingual'
    }
  },

/**
 * Page specific methods
 */
  fetchAndCacheData: function(cb) {
    app.fetchData('https://api.ftmailbox.com/index.php/jsapi/sod', (err, data) => {
      if (err) {return err;} 

// Get only the needed data for cover list
      const bilingualList = data.map(item => {
        return {
          id: item.id,
          image: utils.imageService(item.story_pic.other),
          heading: item.cheadline,
          standfirst: item.clongleadbody
        }
      });

// Set bilingual reading's article list.
      this.setData({
        bilingualList
      });

      typeof cb == 'function' && cb();

// Cache cover list.
      app.cacheData('bilingualList', bilingualList, (err, key) => {
        if (err) {
          console.log('Cache bilingual list failed.');
          return;
        }
      });

// Cache individual article
      data.map(entry => {
        app.cacheData(entry.id, utils.filterArticleData(entry));
      });

// Tracking
      app.ga(gaPath, gaTitle);
    });
  }

})