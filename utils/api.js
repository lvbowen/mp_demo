const fetch = require('./network.js')

export function quickSpLogin(data) {
  return fetch({
    url: '/weipin/quickSpLogin.do',
    method: 'post',
    data
  })
}

export function getCompanyList(data){
  return fetch({
    url:'/api.do',
    method:'post',
    data,
    loading:true
  })
}


