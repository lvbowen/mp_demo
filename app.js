//app.js
App({
  onLaunch: function (options) {
    console.log(options)
    this.globalData.systemInfo = wx.getSystemInfoSync();
  },
  globalData: {
    loginInfo:null,
    userInfo: null,
    systemInfo:null
  }
})