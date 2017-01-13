//index.js
//获取应用实例
const gaPath = '/wx/today-focus';
const gaTitle = '今日焦点';

var app = getApp();

Page({
  data: {
    articleList: []
  },
  //事件处理函数
  bindViewTap: function(e) {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    // Get the article's ID
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this;
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1500,
    });

    app.checkNetwork((err, type) => {
      // If wifi connection, always request to server
      this.fetchAndCacheData(() => {
        wx.hideToast();
      });

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
        this.fetchAndCacheData(() => {
          wx.hideToast();
        });
        
      });
    });
  },

  onShow: function() {
    console.log('onShow');
  },

  onPullDownRefresh: function() {
// Manually request data
    wx.showNavigationBarLoading();
    this.fetchAndCacheData(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    });
  },

/**
 * `path` is the path of the js file. Lik `pages` in app.json but an start with `/`
 */
  onShareAppMessage: function() {
    return {
      title: 'FT今日焦点',
      desc: 'FT中文网今日焦点',
      path: '/pages/index/index'
    }
  },

/**
 * Page specific methods
 */
  fetchAndCacheData: function(cb) {
    app.fetchData('https://api.ftmailbox.com/index.php/jsapi/home', (err, data) => {
      if (err) {return err;}
// Call cb if it exists. Mainly to be used fro onPullDownRefersh
      typeof cb == 'function' && cb();

// Get cover's article list. This is specific to the data structure returned from API.
      const articleList = data.sections.filter(section => {
          return section.name === 'Cover'
        }).map(section => {
          return section.lists.map(list => {
            return list.items;
          });
        })[0][0];

      this.setData({
        articleList
      });

// Cache data
      app.cacheData('articleList', articleList);

// Tracking
      app.ga(gaPath, gaTitle);
    });
  }
});
