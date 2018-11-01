/**
 * 小程序配置文件
 */

// var host = 'https://aijuhr.com/hrm'   //正式
var host = 'https://aijutong.com/hrm'   //测试
// var host = 'http://192.168.5.76:8080/hrm'   //本地1
// var host = 'http://16794ui705.iok.la:45298/hrm'   //本地2

var config = {
  host,
  appId: "wxe1b80f48618e9e63",
  secretKey: 'zdW9Y2ZWEUZ-Jr8wuehrERPiITg-oGtjzpD6dfZv', //sign加密
  lversion: "1.0.0",

  // 上传文件接口
  uploadFileUrl: `${host}/weixin/uploadImg.do`,

  //WebSocket wss地址
  webSocketUrl: `wss://${host.split('//')[1]}/weipinChatWebSocket`

}

module.exports = config;