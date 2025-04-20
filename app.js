// 小程序实例初始化
App({
  // 全局数据存储
  globalData: {
    // 用户信息，初始为null
    userInfo: null,
    // 用户openid，初始为null
    openid: null
  },
  // 小程序启动时执行
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      // 云环境ID
      env: '你申请的云数据库环境',
      // 追踪用户
      traceUser: true
    })
    // 检查登录状态
    this.checkLogin()
  },
  // 登录检查函数
  checkLogin() {
    // 调用云函数
    wx.cloud.callFunction({
      // 调用login云函数
      name: 'login',
      // 传入空数据
      data: {}
    }).then(res => {
      // 将返回的openid存入全局数据
      this.globalData.openid = res.result.openid
    })
  }
})