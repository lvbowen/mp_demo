let config = require("../config.js")
let md5 = require("./md5.min.js")

const fetch = ({
  url,
  method = 'get',
  data = {},
  loading = false,
  disableLint = false
}) => {
  let sign = '';
  let token = wx.getStorageSync('token') || '';   //登录接口返回的token
  let header = {
    "lversion": `${config.lversion}`,
    "token": token,
  }
  if(method === 'get'){
    header["content-type"] = 'application/json';
  }else{
    header["content-type"] = 'application/x-www-form-urlencoded';
  }
  //请求参数按一定规则md5加密
  let newkey = Object.keys(data).sort();
  let newObj = {};
  for (let i = 0; i < newkey.length; i++) {   //遍历newkey数组
    newObj[newkey[i]] = data[newkey[i]];    //向新创建的对象中按照排好的顺序依次增加键值对
  }
  for (let key in newObj) {
    sign += key + '=' + data[key];
  }
  sign = md5(sign + config.secretKey);
  header.sign = sign;

  if(loading){
    wx.showLoading({
      title: '加载中',
    })
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.host}${url}`,
      method: method,
      header: header,
      data: data,
      success: res => {
        if(loading){
          wx.hideLoading()
        }
        resolve(res.data);
        if(res.data.code !== null && res.data.code.toString() !== '0'){     //这里正常请求code会返回'0'
          console.log(url,data);
        }
      },
      fail: (error) => {
        if (error.errMsg.includes('timeout')){
            wx.showToast({
              title: '请求超时，请重试',
              icon:'none'
            })
        }else{
          wx.showToast({
            title: '服务器开小差了。。。',
          })
          console.log(`request fail原因:${error.errMsg}`);
        }
        reject(error);  
      }
    })
  })
}

module.exports = fetch;