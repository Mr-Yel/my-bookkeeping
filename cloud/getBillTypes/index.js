// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const billTypesCollection = db.collection('bill_types');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const { bill_type } = event
    
    const res = await billTypesCollection.where({
      bill_type: bill_type
    }).get()
    if(res && res.data && res.data.length) {
      return {
        success: true,
        data: res.data
      }
    }else {
      return {
        success: true,
        data: []
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