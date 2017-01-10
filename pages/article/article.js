const WxParse = require('../../wxParse/wxParse.js');
const utils = require('../../utils/util.js');
const app = getApp();


Page({
    data: {
      title: '',
      standfirst: '',
      mainImage: '',
      publishDate: '',
      byline: '',
      body: ''
    },
    
    onLoad: function(options) {
        var that = this;
        console.log(options.id);

        wx.request({
          url: 'https://api.ftmailbox.com/index.php/jsapi/get_story_more_info/' + options.id,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          dataType: 'json',
          header: {
              'Accept': 'application/json'
          }, // 设置请求的 header
          success: function(res){
            // success
            console.log(res);
            that.setData({
              title: res.data.cheadline,
              standfirst: res.data.clongleadbody,
              mainImage: res.data.story_pic.other,
              publishDate: utils.formatTime(new Date(res.data.last_publish_time * 1000)),
              byline: res.data.cbyline_description + ' ' + utils.convertByline(res.data.cauthor, res.data.cbyline_status)
            });

            // var body = res.data.cbody;
            var body = res.data.ebody ? utils.zipBilingual(res.data.ebody, res.data.cbody) : res.data.cbody;
            WxParse.wxParse('body', 'html', body, that);

          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
});