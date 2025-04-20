const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { openid } = event
    // 检查 openid 是否存在
    if (!openid) {
      console.error('缺少 openid 参数')
      throw new Error('缺少 openid 参数')
    }

    console.log('开始查询用户信息，openid:', openid)
    // 查询用户信息，使用 ES6 简写
    const res = await db.collection('users').where({
      openid
    }).get()

    if (res.data.length > 0) {
      console.log('成功获取用户信息，openid:', openid)
      return {
        success: true,
        userInfo: res.data[0]
      }
    } else {
      console.log('未找到对应的用户信息，openid:', openid)
      return {
        success: false,
        message: '未找到对应的用户信息'
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      success: false,
      message: '获取用户信息失败',
      error: error.message
    }
  }
}