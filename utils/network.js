let config = require("../config.js")
let md5 = require("./md5.min.js")

const fetch = ({
  url,
  method = 'get',
  data = {},
  loading = false,
  disableLint = false
}) => {
  let header = {
    "lversion": `${config.lversion}`
  }
  if(method === 'get'){
    header["content-type"] = 'application/json';
  }else{
    header["content-type"] = 'application/x-www-form-urlencoded';
  }
  if (url.includes('api.do')) {   //根据自己项目的加密规则定义sign，放在参数data里或者请求头header传递
    data.sign = md5('method' + data.method + "param" + data.param + "ecbao")
  }
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