// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const { property, budget_id } = event
    if(!budget_id) {
      return {
        success: false,
        msg: 'budget_id 未传入'
      }
    }
    if(!property) {
      return {
        success: false,
        msg: 'property 未传入'
      }
    }
    const collection = db.collection('budget')
    const res = await collection.doc(budget_id).update({data: {property: property}})
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
