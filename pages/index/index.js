//index.js
//获取应用实例
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
          app.ga('/', '今日焦点');

          return;
        }

        // If there is error, request data to server
        this.fetchAndCacheData();
      });
    });
  },

  onShow: function() {
    console.log('onShow');
  },

  onPullDownRefresh: function() {
    // Manually request data
    this.fetchAndCacheData();
  },

  fetchAndCacheData: function() {
    app.fetchData('https://api.ftmailbox.com/index.php/jsapi/home', (err, data) => {
      if (err) {return err;}
      // Get cover's article list. This is specifi to the data structure returned from API.
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
      console.log(articleList);
      // Cache data
      app.cacheData('articleList', articleList, (err, key) => {
        if (err) {
          console.log('Cache article list failed.');
          return;
        }
      });
// Tracking
      app.ga('/', '今日焦点');
    });
  }
})
