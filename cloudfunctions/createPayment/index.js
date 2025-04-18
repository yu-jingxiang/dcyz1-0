const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const crypto = require('crypto')

// 微信支付配置，需要替换为你自己的信息
const config = {
  mchId: '你的商户号', 
  apiKey: '你的API密钥', 
  appId: '你的小程序AppID' 
}

// 生成随机字符串
function generateNonceStr() {
  return Math.random().toString(36).substr(2, 15)
}

// 生成签名
function generateSign(params) {
  const sortedParams = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== '' && key !== 'sign')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  const stringSignTemp = `${sortedParams}&key=${config.apiKey}`
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase()
}

exports.main = async (event, context) => {
  const { openid, amount, description } = event

  // 统一下单请求参数
  const params = {
    appid: config.appId,
    mch_id: config.mchId,
    nonce_str: generateNonceStr(),
    body: description,
    out_trade_no: Date.now().toString(), // 生成唯一订单号
    total_fee: amount,
    spbill_create_ip: context.CLIENTIP,
    notify_url: 'https://你的回调域名/notify', // 支付结果通知地址
    trade_type: 'JSAPI',
    openid: openid
  }

  // 生成签名
  params.sign = generateSign(params)

  // 调用微信支付统一下单接口
  const result = await cloud.cloudPay.unifiedOrder({
    ...params
  })

  // 生成小程序支付所需参数
  const paymentParams = {
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: generateNonceStr(),
    package: `prepay_id=${result.prepay_id}`,
    signType: 'MD5'
  }

  // 生成支付签名
  paymentParams.paySign = generateSign(paymentParams)

  return {
    paymentParams
  }
}