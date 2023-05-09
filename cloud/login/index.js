// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    const collection = db.collection('users')
    console.log('这是openid', openid);
    const res = await collection.where({
      openid: openid
    }).get()

    console.log('这是openid的查询结果', res);

    if(res && res.data && res.data.length) {
      // openid 为每个用户的唯一标识，一定是唯一的
      // 存在用户数据，返回
      const userInfo = res.data[0]
      return {
        success: true,
        data: userInfo
      }
    }else {
      // 不存在用户信息，通过 openid 新建用户，默认的名字和头像为空
      const newUser = {
        name: '',
        picture: '',
        openid: openid,
      }
      const res = await collection.add({
        data: {
         ...newUser
        }
      })
      return {
        success: true,
        data: res
      }
    }
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}

// // 云函数入口函数
// exports.main = async (event, context) => {
//   try {
//     const db = cloud.database()
//     const collection = db.collection('todo')
//     const res = await collection.get()
//     console.log(res)
//     return res
//   } catch (err) {
//     console.log(err)
//     return err
//   }
// }