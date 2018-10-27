const fetch = require('./network.js')

//登录
export function quickSpLogin(data) {
  return fetch({
    url: '/weipin/quickSpLogin.do',
    method: 'post',
    data
  })
}

//保存用户信息
export function saveUserInfo(data) {
  return fetch({
    url: '/weipin/saveQuickSpFans.do',
    method: 'post',
    data
  })
}

//保存formId，用于发送模板消息
export function saveFormId(data) {
  return fetch({
    url: '/weipin/saveFormid.do',
    method: 'post',
    data
  })
}

//解密授权手机号
export function getPhone(data) {
  return fetch({
    url: '/weipin/getQuickSpFansPhone.do',
    method: 'post',
    data
  })
}


//获取公司列表
export function getCompanyList(data){
  return fetch({
    url:'/api.do',
    method:'post',
    data,
    loading:true
  })
}


