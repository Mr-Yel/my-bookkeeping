// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');
cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const budgetCollection = db.collection('budget');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const { time } = event;
    const res = await budgetCollection
      .where({
        start_time: _.lte(dayjs(time).toDate()),
        end_time: _.gte(dayjs(time).toDate()),
        openid: openid
      })
      .get()
    
    return {
      data: res && res.data && res.data[0] || undefined,
      success: true,
    }
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}