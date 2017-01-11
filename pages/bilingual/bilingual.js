// pages/bilingual/bilingual.js
//获取应用实例
var app = getApp();

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    
    wx.request({
      url: 'https://api.ftmailbox.com/index.php/jsapi/sod',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      dataType: 'json',
      header: {
        'Accept': 'application/json'
      }, // 设置请求的 header
      success: function(res){
        console.log(res);

        that.setData({
          articleList: res.data
        });

        // success
      },
      fail: function() {
        // fail
        console.log('request failed.');
      },
      complete: function() {
        // complete
        console.log('request completed.');
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