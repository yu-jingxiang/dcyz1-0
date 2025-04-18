Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      openid: getApp().globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  }
})