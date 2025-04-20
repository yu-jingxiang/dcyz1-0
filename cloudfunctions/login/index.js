

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env:'cloud1-1g5h1x4gedf32b2d'})

exports.main = async (event, context) => {
  const { code } = event
  
  try {
    // 获取微信上下文
    const wxContext = await cloud.getWXContext()
    console.log('微信上下文:', wxContext) // 调试日志
    
    if (!wxContext.OPENID) {
      console.error('无法获取OPENID:', wxContext)
      return { error: '获取用户标识失败' }
    }
    
    const openid = wxContext.OPENID // 使用大写OPENID
    const db = cloud.database()
    
    // 测试数据库连接
const testDB = await db.collection('users').count()
console.log('数据库连接测试:', testDB)
  if (!openid) {
    return { error: 'openid is required' }
  }
  const user = await db.collection('users').where({ openid }).get()
  
  // 记录登录日志
  await db.collection('loginLogs').add({
    data: {
      userId: openid,
      loginTime: db.serverDate(),
      ip: context.CLIENTIP
    }
  })
  
  // 如果用户不存在则自动创建
  if (user.data.length === 0) {
    await db.collection('users').add({
      data: {
        openid,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate(),
        profileComplete: false // 标记用户资料是否完善
      }
      })
  }

  // 返回用户信息
  return {
    openid,
    isRegistered:true,
    profileComplete: user.data.length > 0 ? user.data[0].profileComplete : false
  }
  
} catch (err) {
  console.error('云函数执行错误:', err)
  return { error: '服务器异常' }
}
}
