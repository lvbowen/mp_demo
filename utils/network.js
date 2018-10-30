let config = require("../config.js")
let md5 = require("./md5.min.js")

const _requestCacheMap = {};

const fetch = ({
  url,
  method = 'get',
  data = {},
  loading = false,
  disableLint = false
}) => {
  // 判断是否正在请求中，防止重复请求，或者请求过于频繁
  const nameSpace = method + url + JSON.stringify(data);
  let requestCache = _requestCacheMap[nameSpace];
  if (!disableLint && typeof requestCache === 'object') {
    if (requestCache.status == true) {
      throw new Error(`请勿重复提交${nameSpace}`)
    } else if (Date.now() - requestCache.timestamp < 3000) {
      throw new Error(`请求过于频繁${nameSpace}`)
    }
  }

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

  //开始请求
  _requestCacheMap[nameSpace] = {
    status: true,
    timestamp: Date.now()
  }
  console.log(_requestCacheMap, _requestCacheMap[nameSpace])
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.host}${url}`,
      method: method,
      header: header,
      data: data,
      success: res => {
        _requestCacheMap[nameSpace].status = false;
        if(loading){
          wx.hideLoading()
        }
        resolve(res.data);
        if(res.data.code !== null && res.data.code.toString() !== '0'){     //这里正常请求code会返回'0'
          console.log(url,data);
        }
      },
      fail: (error) => {
        _requestCacheMap[nameSpace].status = false;
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