//app.js

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    wx.login({
      success: function(res){
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  onShow: function() {
    
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
    userInfo:null,
    cid: null
  },

// The following are custom methods used by all pages.
// All callback follow node.js style callback of receiving error as first parameter
/*
 * @param {String} url - the destination to request data
 * @param {Function} cb - (err, data) Receive request error or retruned data
 */
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
        typeof cb == 'function' && cb(null, res.data);
      },
      fail: function() {
        // fail
        typeof cb == 'function' && cb(new Error('EREQUEST'));
      },
      complete: function() {
        // complete
        console.log(`request to ${url} completed`);
      }
    });
  },

/* 
 * @param {Function} wifiCb - do whatever if user device is connected via wifi
 * @param {Function} dataLinkCb - do whatever if user device is connected via data link
 */
  checkNetwork: function(wifiCb, dataLinkCb) {
    wx.getNetworkType({
      success: function(res) {
        // success
        
        if (res.networkType === 'wifi') {
          typeof wifiCb == 'function' && wifiCb(null, res.networkType);
        } else {
          typeof dataLinkCb == 'function' && dataLinkCb(null, res.networkType);
        }
      },
      fail: function() {
        typeof wifiCb == 'function' && wifiCb(new Error('EACCESSNET'));
        typeof dataLinkCb == 'function' && dataLinkCb(new Error('EACCESSNET'));
      },
      complete: function() {
        console.log('Check networkType');
      }
    });
  },

/*
 * @param {String} key
 * @param {Object | String} value
 * @param {Function} cb - used to handle error (err, key).
 */ 
  cacheData(key, value, cb) {
    wx.setStorage({
      key: String(key),
      data: value,
      success: function(res){
        // success
        // Pass key to cb
        typeof cb == 'function' && cb(null, key);
      },
      fail: function() {
        // fail
        typeof cb == 'function' && cb(new Error('ECACHE'));
      },
      complete: function() {
        // complete
        console.log(`Cache ${key} completed`);
      }
    });
  },

/*
 * @param {String} key
 * @param {Function} cb - (err, data)
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
        typeof cb == 'function' && cb(new Error('ERTRV'));
      },
      complete: function() {
        // complete
        console.log('Retrieving Completed.')
      }
    })
  },

/*
 * Use ga `Meassurment Protocol` for trakcing.
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/
 */
  ga: function (documentPath, documentTitle) {
    wx.request({
      url: 'https://www.google-analytics.com/collect',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        v: 1,
        tid: 'UA-1608715-1',
        t: 'pageview',
        dh: 'ftchinese.com',
        dp: documentPath,
        dt: documentTitle,
        an: 'FTCWXAPP'
      },
      success: function(res) {
        console.log(res);
      },
      fail: function() {
        console.log('Sending ga failed.');
      }
    });
  } 
});