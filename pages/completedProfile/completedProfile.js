Page({
  data: {
    userInfo: {},
    isSubmitting: false // 提交状态，防止重复提交
  },

  handleSubmit(e) {
    const formData = e.detail.value;
    formData.openid = getApp().globalData.openid;
    console.log('表单数据:', formData);

    // 输入验证
    if (!this.validateForm(formData)) {
      return;
    }

    // 防止重复提交
    if (this.data.isSubmitting) {
      wx.showToast({
        title: '正在提交，请稍后',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({ isSubmitting: true });
    wx.showLoading({
      title: '提交中...',
      mask: true
    });

    // 调用云函数
    const cloudTask = wx.cloud.callFunction({
      name: 'completeProfile', // 云函数名称，需要根据实际情况修改
      data: formData,
      success: (res) => {
        console.log('云函数调用成功', res);
        if (res.result && res.result.code === 200) { // 假设云函数返回 code 200 表示成功
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          // 提交成功后的跳转逻辑
          wx.switchTab({
            url: '/pages/user/user'
          });
        } else {
          console.error('云函数返回异常', res);
          wx.showToast({
            title: '提交失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('云函数调用失败', err);
        if (err.errMsg.includes('timeout')) {
          wx.showToast({
            title: '请求超时，请重试',
            icon: 'none',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '提交失败，请检查网络',
            icon: 'none',
            duration: 2000
          });
        }
      },
      complete: () => {
        this.setData({ isSubmitting: false });
        wx.hideLoading();
      }
    });

    // 页面卸载时取消请求
    this.onUnload = () => {
      if (cloudTask) {
        cloudTask.cancel();
      }
    };
  },

  // 表单验证函数
  validateForm(formData) {
    // 示例验证：假设表单有 name 和 phone 字段
    const trimmedName = (formData.realName || '').trim();
    if (!trimmedName) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (!formData.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    // 可以添加更多验证规则，如手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    return true;
  }
});