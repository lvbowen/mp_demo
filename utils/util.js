/**
 * 格式化标准时间
 * @param {Number} date - 时间戳
 * return {String} eg : 2018/01/02 12:12:12
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 格式化日期
 * @param {Number} date - 时间戳
 * @param {String} type - 格式化类型，如month、time
 */
const formatDate = (date, type) => {
  if (date == "" || date == null) {
    return;
  } else {
    var d = new Date(date);
    var newdate = "";
    if (type == "month") {
      newdate = d.getFullYear() + "-" + (d.getMonth() > 8 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1));
    } else if (type == "time") {
      newdate = d.getFullYear() + '-' +
        (d.getMonth() > 8 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) + '-' +
        (d.getDate() > 9 ? d.getDate() : "0" + (d.getDate())) +
        " " + (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) + ":" +
        (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) + ":" +
        (d.getSeconds() > 9 ? d.getMinutes() : "0" + d.getMinutes());
    } else {
      newdate = d.getFullYear() + '-' +
        (d.getMonth() > 8 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) + '-' +
        (d.getDate() > 9 ? d.getDate() : "0" + (d.getDate()));
    }
    return newdate
  }
}


/**
 * 扩展对象，深拷贝
 * utils.extendObj({}, obj1, obj2)  等同于 Object.assign({}, obj1, obj2) 或者 扩展运算符 let newObj = {...obj1, obj2}
 */
const extendObj = target => {
  let sources = Array.prototype.slice.call(arguments, 1);

  for (let i = 0; i < sources.length; i += 1) {
    let source = sources[i];
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

/**
 * 窗口高度换成rpx为单位对应的数值
 */
const rpxHeight = () => {
  let systemInfo = wx.getSystemInfoSync();
  return systemInfo.windowHeight * (750 / systemInfo.windowWidth)
}

/**
 * 解析小程序码scene参数
 * @param { String } scene - 码中的 scene 字段的值
 */
const parseScene = (scene) => {
  let deScene = decodeURIComponent(scene);
  let arr = deScene.split("&");
  let obj = {};
  arr.forEach(function(item) {
    obj[item.split('=')[0]] = item.split('=')[1]
  })
  return obj;
}

/**
 * 获取某节点的信息
 * @param {String} id - 节点的选择器，最好为id比较好
 * @param {Function} callback - 异步回调函数
 */
const getWxmlInfo = (id, callback) => {
  //创建节点选择器
  let query = wx.createSelectorQuery();
  //选择id
  query.select(id).boundingClientRect((res) => {
    callback && callback(res);
  }).exec()
}

/**
 * 获取节点的信息
 * @param {String} selector - 节点的选择器
 * @param {Function} callback - 异步回调函数
 */
const getWxmlInfoAll = (selector, callback) => {
  //创建节点选择器
  let query = wx.createSelectorQuery();
  //选择id
  query.selectAll(selector).boundingClientRect((res) => {
    callback && callback(res);
  }).exec()
}

/**
 * 获取当前网络状态
 */
const getNetwork = (cb) => {
  wx.getNetworkType({
    success(res){
      let isConnected = true;
      if (res.networkType === 'none'){
        isConnected = false;
        wx.showModal({
          title: '提示',
          content: '当前无网络,将无法正常使用小程序',
          showCancel: false,
          success: function (res2) {
            if (res2.confirm) { }
          }
        });
      }
      res.isConnected = isConnected;
      cb && cb(res);
    }
  })
}


// 常用正则表达式
const PregRule = {
  Email: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, //邮箱
  Account: /^[a-zA-Z0-9_]{2,20}$/, // 账户
  Pwd: /^[a-zA-Z0-9_~!@#$%^&*()]{6,25}$/i, // 密码
  Tel: /^(13|14|15|18|17)[0-9]{9}$/, //手机
  FixedAndTel: /(^0\d{2,3}-\d{7,8}$)|(^1[3|4|5|6|7|8][0-9]{9}$)/, //座机或手机号
  IDCard: /^\d{17}[\d|X|x]|\d{15}$/, //身份证 
  Number: /^\d+$/, //数字
  IntegerNumber: /^[1-9]\d*(\.\d+)?$/, //大于0必须输入合同金额(数字)!")
  Integer: /^[-\+]?\d+$/, //正负整数
  IntegerZ: /^[1-9]\d*$/, //正整数 
  IntegerF: /^-[1-9]\d*$/, //负整数
  Chinese: /^[\u0391-\uFFE5]+$/,
  Zipcode: /^\d{6}$/, //邮编
  Authcode: /^\d{6}$/, //验证码
  QQ: /^\d{4,12}$/, // QQ
  Price: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // 价格
  Money: /^(0|[1-9]\d*)(\.\d{1,4})?$/, // 金额
  Letter: /^[A-Za-z]+$/, //字母
  LetterU: /^[A-Z]+$/, //大写字母
  LetterL: /^[a-z]+$/, //小写字母
  Url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/, // URL
  Date: /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/, //日期
  Domain: /^[a-zA-Z0-9]{4,}$/ //自定义域名
}


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  rpxHeight: rpxHeight,
  parseScene: parseScene,
  getWxmlInfo: getWxmlInfo,
  getWxmlInfoAll: getWxmlInfoAll,
  PregRule: PregRule,
  getNetwork: getNetwork
}