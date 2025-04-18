Page({
  // 页面初始化函数，包含页面数据和生命周期函数
  data: {}, // 页面数据对象，用于存储页面状态和数据
  onLoad() {
    // 页面加载时执行的函数，主要用于用户登录
    this.handleLogin()
  },

  // 添加登录方法
  handleLogin: function() {
   
    wx.login({
      success: async (res) => {
        try {
          const result = await wx.cloud.callFunction({
            name: 'login',
            config: { env: 'cloud1-1g5h1x4gedf32b2d' },
            data: { code: res.code }
          })
          console.log('云函数返回:', result)
          
          if (result.result.isRegistered) {
            wx.navigateTo({ url: '/pages/user/completeProfile' })
          } else {
            wx.navigateTo({ url: '/pages/user/user' })
          }
        } catch (error) {
          console.error('云函数调用失败:', error)
          wx.showToast({ title: '登录失败', icon: 'none' })
        }
      },
      fail: (err) => {
        console.error('微信登录失败:', err)
      }
    })
  }
})