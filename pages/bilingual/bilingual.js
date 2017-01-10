// pages/bilingual/bilingual.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
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
  }
})