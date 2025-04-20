Page({
  data: {
    userInfo: null,
    isLoading: true // 新增加载状态
  },

  onLoad() {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    // 检查全局数据中的 openid 是否存在
    if (!getApp().globalData.openid) {
      console.error('全局数据中 openid 不存在');
      wx.hideLoading();
      wx.showToast({
        title: '获取 openid 失败',
        icon: 'none'
      });
      return;
    }

    // 调用云函数
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        openid: getApp().globalData.openid
      },
      success: res => {
        // 隐藏加载提示
        wx.hideLoading();
        if (res.result.success) {
          this.setData({
            userInfo: res.result.userInfo
          });
          console.log('获取用户信息成功:', this.data.userInfo);
        } else {
          console.log(res.result.message);
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        // 隐藏加载提示
        wx.hideLoading();
        console.error('调用云函数失败:', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    })
  }
});