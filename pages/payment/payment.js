Page({
  data: {
    // 支付金额，单位为分
    amount: 100,
    // 支付描述
    description: '测试支付'
  },
  // 处理支付请求
  handlePayment() {
    // 调用云函数创建支付订单
    wx.cloud.callFunction({
      name: 'createPayment',
      data: {
        openid: getApp().globalData.openid,
        amount: this.data.amount,
        description: this.data.description
      }
    }).then(res => {
      // 调用微信支付接口
      wx.requestPayment({
        timeStamp: res.result.paymentParams.timeStamp,
        nonceStr: res.result.paymentParams.nonceStr,
        package: res.result.paymentParams.package,
        signType: 'MD5',
        paySign: res.result.paymentParams.paySign,
        success: () => {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })
        },
        fail: () => {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    })
  }
})