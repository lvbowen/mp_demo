
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
               if (sessionId !== res.data.sessionId) {     //不同则更新，后台设置5个小时过期，维护登录态，避免后台每次都调微信登录接口
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
   * 授权用户信息
   */
  _authUserInfo(fansId){
    let _this = this;
    wx.getUserInfo({
      withCredentials:true,
      success: response => {
        // 允许授权，保存用户信息
        let eniv = {
          en: response.encryptedData,
          iv: response.iv
        }
        _this._saveUserInfo(response.userInfo, fansId, eniv);
      },
      fail:(err)=>{
        _this._cb2 && _this._cb2();
        wx.navigateTo({
          url: '/pages/generation/authorize/authorize',
        })
      }
    })
  },
  /**
   * 保存用户信息
   */
  _saveUserInfo(userInfo, fansId, eniv, callback){
    let _this = this;
    let _userInfo = Object.assign({},userInfo, { id: fansId })
    wx.setStorageSync('userInfo', userInfo);
    wx.request({
      url: config.host + '/weipin/saveQuickSpFans.do',
      method: "POST",
      header: {
        "lversion": `${config.lversion}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userInfo: JSON.stringify(_userInfo),
        encryptedData: eniv.en,
        iv: eniv.iv,
        sessionId: wx.getStorageSync('sessionId')
      },
      success: function (res) {
        if(res.data.code == '0'){
          getApp().globalData.userInfo = userInfo
        }
        callback && callback();
        _this._cb2 && _this._cb2(); 
      },
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