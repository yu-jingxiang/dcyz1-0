Page({
  // 页面数据初始化
  data: {
    users: [], // 用户列表
    payments: [] // 支付记录列表
  },
  // 页面加载时执行的函数
  onLoad() {
    this.getUsers() // 获取用户列表
    this.getPayments() // 获取支付记录
  },
  // 获取用户列表的函数
  getUsers() {
    const db = wx.cloud.database() // 获取数据库实例
    db.collection('users').get().then(res => { // 查询用户集合
      this.setData({
        users: res.data // 将查询结果设置到页面数据中
      })
    })
  },
  // 获取支付记录的函数
  getPayments() {
    const db = wx.cloud.database() // 获取数据库实例
    db.collection('paymentRecords').get().then(res => { // 查询支付记录集合
      this.setData({
        payments: res.data // 将查询结果设置到页面数据中
      })
    })
  }
})