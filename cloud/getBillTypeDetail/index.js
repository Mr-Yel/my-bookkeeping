// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const billTypesCollection = db.collection('bill_types');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    /*
    * _id String 账单类型id,
    */
    const { _id } = event

    if(!_id) {
      return {
        success: false,
        msg: '缺少id'
      }
    }
    
    const getBillTypeRes = await billTypesCollection.doc(_id).get();

    console.log(getBillTypeRes.data);

    return {
      success: true,
      data: getBillTypeRes.data
    }
    
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}