//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    coverItems: []
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

    wx.request({
      url: 'https://api.ftmailbox.com/index.php/jsapi/home',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      dataType: 'json',
      header: {
        'Accept': 'application/json'
      }, // 设置请求的 header
      success: function(res){

        const sections = res.data.sections.filter(section => {
          return section.hasOwnProperty('lists');
        });

        const coverItems = sections[0].lists[0].items;

        that.setData({
          coverItems: coverItems
        });

        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})
