// 云函数入口文件
const cloud = require('wx-server-sdk') // 引入微信云开发SDK
cloud.init() // 初始化云开发环境

// 主函数，处理用户资料完善请求
// event参数包含用户提交的数据，context包含调用上下文信息
exports.main = async (event, context) => {
  try {
    // 从event中解构出用户提交的数据
    const { openid, realName, phone, address } = event
    
    // 参数校验：确保所有必填项都已填写
    if (!openid || !realName || !phone || !address) {
      throw new Error('缺少必要参数')
    }
    
    // 获取数据库实例和操作符
    const db = cloud.database()
    const _ = db.command
    
    // 更新用户资料：根据openid查找用户并更新资料
    // 如果用户存在，则更新资料并设置更新时间
    const result = await db.collection('users').where({ openid })
      .update({
        data: {
          realName, // 真实姓名
          phone,   // 联系电话
          address, // 联系地址
          updatedAt: _.set(db.serverDate()) // 设置更新时间
        }
      })
      
    // 如果用户不存在则创建新用户
    // 当更新操作返回的updated为0时，表示用户不存在
    if (result.stats.updated === 0) {
      await db.collection('users').add({
        data: {
          openid,    // 用户唯一标识
          realName,  // 真实姓名
          phone,     // 联系电话
          address,   // 联系地址
          createdAt: db.serverDate(), // 创建时间
          updatedAt: db.serverDate()  // 更新时间
        }
      })
    }
    
    // 返回成功结果
    return { success: true }
  } catch (error) {
    // 捕获并记录错误
    console.error('completeProfile error:', error)
    // 返回失败结果和错误信息
    return { success: false, error: error.message }
  }
}