// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    if(!event._id) {
      return {
        success: false,
        errMsg: '不存在 _id',
      }
    }
    const billsCollection = db.collection('bills')
    const res = await billsCollection.doc(event._id).remove()
    return {
      success: true,
      data: res
    }
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}
