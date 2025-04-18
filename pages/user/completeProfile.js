Page({
  data: {
    userInfo: {}
  },

  handleSubmit(e) {
    const formData = e.detail.value;
    console.log('表单数据:', formData);

    // 调用云函数
    wx.cloud.callFunction({
      name: 'completeProfile', // 云函数名称，需要根据实际情况修改
      data: formData,
      success: (res) => {
        console.log('云函数调用成功', res);
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
         可以在这里添加提交成功后的跳转逻辑
         wx.navigateTo({
           url: '/pages/payment/payment'
         });
      },
      fail: (err) => {
        console.error('云函数调用失败', err);
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});