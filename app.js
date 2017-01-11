//app.js
const utils = require('./utils/util.js');

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    wx.getNetworkType({
      success: function(res) {
        console.log(res);
      }
    });
  },

  onShow: function() {
    // check cache. If exists, use cached data
  },

  onHide: function() {

  },

  onError: function(msg) {
    console.log('App launch error');
    console.log(msg);
  },

  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData:{
    userInfo:null
  },

// All callback follow node.js style callback of receiving error as first parameter
  fetchData: function(url, cb) {
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      dataType: 'json',
      header: {
        'Accept': 'application/json'
      }, // 设置请求的 header
      success: function(res){
        // success
        console.log(res);
        typeof cb == 'function' && cb(null, res.data);
      },
      fail: function() {
        // fail
        console.log(`request to ${url} failed`);
        typeof cb == 'function' && cb(new Error('EREQUEST'));
      },
      complete: function() {
        // complete
        console.log(`request to ${url} completed`);
      }
    });
  },

  fetchArticle: function(url, cb) {
    this.fetchData(url, (err, data) => {
      if (err) { return err;}
      const articleData = {
        title: data.cheadline,
        standfirst: data.clongleadbody,
        mainImage: data.story_pic.other,
        publishDate: utils.formatTime(new Date(data.last_publish_time * 1000)),
        byline: data.cbyline_description + ' ' + utils.convertByline(data.cauthor, data.cbyline_status),
        cbody: data.cbody,
        ebody: data.ebody
      };

      typeof cb == 'function' && cb(articleData);
    });
  },

  checkNetwork: function(cb) {
    wx.getNetworkType({
      success: function(res) {
        // success
        typeof cb == 'function' && cb(null, res.networkType);
      },
      fail: function() {
        typeof cb == 'function' && cb(new Error('EACCESSNET'));
      },
      complete: function() {
        console.log('Check networkType');
      }
    });
  },

  storeData(key, value, cb) {
    wx.setStorage({
      key: key,
      data: value,
      success: function(res){
        // success
        console.log(`Store data ${key} success.`);
      },
      fail: function() {
        // fail
        console.log(`failed to cache ${key}`)
        typeof cb == 'function' && cb(new Error({
          errMsg: 'ECACHE',
          key: key
        }));
      },
      complete: function() {
        // complete
        console.log(`Store data ${key} completed`);
      }
    });
  },

/*
 * Usage: 
 * retrieveData(key, function(res) {
 *    if (res) {
 *      //set data using res;
 *      return;
 *    }
 *    getData(url, function(data) {
 *      // set data using data
 *      storeData(key, data);
 *    });
 * })
 */
  retrieveData: function(key, cb) {
    wx.getStorage({
      key: key,
      success: function(res){
        // success
        typeof cb == 'function' && cb(null, res.data);
      },
      fail: function() {
        // fail
        typeof cb == 'function' && cb({
          errMsg: 'ERTRV',
          key: key
        });
      },
      complete: function() {
        // complete
        console.log('Retrieving Completed.')
      }
    })
  }
})