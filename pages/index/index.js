//index.js
//获取应用实例
var app = getApp()

const utils = require('../../utils/util.js');
const gaPath = '/wx/life-style'
const gaTitle = '生活时尚';

Page({
  data:{},
  onLoad:function(){
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
    });

    app.checkNetwork((err, type) => {
// If wifi connection, always request to server
      this.fetchAndCacheData(wx.hideToast);

    }, (err, type) => {
// If data connection, try to get data from cache first. If failed, then asking server for data.
      app.retrieveData('coverList', (err, data) => {
// If there is no error, data is retrieved from cache
        if (!err) {
          console.log('Cover list retrieved from cache');
          this.setData({
            coverList: data
          });

          wx.hideToast();
// Tracking
          app.ga(gaPath, gaTitle);
          return;
        }

// If there is error, request data to server
        this.fetchAndCacheData(wx.hideToast);

      });
    });
  },

  onPullDownRefresh: function() {
// Manually request data
    this.fetchAndCacheData(wx.stopPullDownRefresh);
  },

  onShareAppMessage: function() {
    return {
      title: 'FT生活时尚',
      desc: 'FT生活时尚',
      path: '/pages/index/index'
    }
  },

/**
 * Page specific methods
 */
  fetchAndCacheData: function(cb) {
    app.fetchData('https://api.ftmailbox.com/index.php/jsapi/lifestyle', (err, data) => {
      if (err) {return err;} 
// Get only the needed data for cover list
      const coverList = data.map(item => {
        const pic = item.story_pic;
        const imageUrl = pic.cover ? pic.cover : pic.other;
        return {
          id: item.id,
          image: utils.imageService(imageUrl),
          heading: item.cheadline,
          standfirst: item.clongleadbody
        }
      });

// Set data
      this.setData({
        coverList
      });

      typeof cb == 'function' && cb();

// Cache list.
      app.cacheData('coverList', coverList, (err, key) => {
        if (err) {
          console.log('Cache bilingual list failed.');
          return;
        }
      });

// Cache individual article
      data.map(article => {
        app.cacheData(article.id, utils.filterArticleData(article));
      });

// Tracking
      app.ga(gaPath, gaTitle);
    });
  }

});
