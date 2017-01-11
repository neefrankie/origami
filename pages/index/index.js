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

    app.fetchData('https://api.ftmailbox.com/index.php/jsapi/home', (err, data) => {
      if (err) {return err;}
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
    });

  },

  onShow: function() {
    console.log('onShow');
    
  },

  onPullDownRefresh: function() {
    // update data
    
  }
})
