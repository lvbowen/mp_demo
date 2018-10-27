
const app = getApp()
const config = require("../config.js")
const apis = require('./api.js')

let user = {
  _cb:null,
  // 登录
  login: function (cb) {
    this._cb = cb;
    let _this = this;
    let sessionId = wx.getStorageSync("sessionId") || '';
    wx.login({
      success: response => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (response.code) {
          apis.quickSpLogin({ code: response.code, sessionId: sessionId}).then((res) => {
             if(res.code == '0'){
               app.globalData.loginInfo = res.data;
               if (sessionId !== res.data.sessionId) {   //不同则更新，后台设置5个小时过期，维护登录态，避免后台每次都调微信登录接口(有时取名为'token')
                 wx.setStorageSync('sessionId', res.data.sessionId);
               }
               cb && cb(res.data);
             }else{
               console.log('登录失败')
             }
          })
        }
      }
    })
  },
  /**
   * 保存用户信息
   */
  saveUserInfo(userInfo, fansId, eniv, callback){
    let _this = this;
    let _userInfo = Object.assign({},userInfo, { id: fansId })
    wx.setStorageSync('userInfo', userInfo);
    apis.saveUserInfo({
      userInfo: JSON.stringify(_userInfo),
      encryptedData: eniv.en,
      iv: eniv.iv,
      sessionId: wx.getStorageSync('sessionId')
    }).then((res) => {
      if (res.code == '0') {
        app.globalData.userInfo = userInfo
      }
      callback && callback();
    })
  },
  /**
   *  是否授权了用户信息
   */
  isAuthUserInfo(){
    if (wx.getStorageSync('userInfo')) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = user