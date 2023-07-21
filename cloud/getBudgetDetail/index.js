// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');
cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const budgetCollection = db.collection('budget');
const budgetBaseCollection = db.collection('budget_base');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const { time } = event;
    let res = await budgetCollection
      .where({
        start_time: _.lte(dayjs(time).toDate()),
        end_time: _.gte(dayjs(time).toDate()),
        openid: openid
      })
      .get()

    if(!res.data || res.data.length == 0) {
      // 获取所在月份的最开始一秒
      const firstSecondOfMonth = dayjs(time).startOf('month').toDate();
      // 获取所在月份的最后一秒
      const lastSecondOfMonth = dayjs(time).endOf('month').toDate();
      const getPropertyRes = await budgetBaseCollection.where({openid: openid}).get()
      const property = getPropertyRes && getPropertyRes.data && getPropertyRes.data.length ?
       getPropertyRes.data[0].property :
       0
      const newBudget = {
        account_book_id: event.account_book_id,
        openid: openid,
        start_time: firstSecondOfMonth,
        end_time: lastSecondOfMonth,
        property: property,
        bill_type_id: ''
      }
      const addRes = await budgetCollection
        .add({
          data: {
            ...newBudget,
          }
        })
      
      const getRes = await budgetCollection.where({_id: addRes._id}).get()
      res = getRes
    }
    
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