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
    const collection = db.collection('bills')
    const billData = {}
    if(event._id) {
      let billListRes = collection.doc(event._id).get()
      if(billListRes && billListRes.list && billListRes.list[0]) {
        billData = billListRes.list[0]
      }
    }
    const newBill = {
      amount: event.amount || billData.amount || 0,
      bill_type_id: event.bill_type_id || billData.bill_type_id || '',
      date_time: dayjs(event.date_time).toDate() || billData.date_time || dayjs().toDate(),
      account_book_id: event.account_book_id || billData.account_book_id || '',
      account_id: event.account_id || billData.account_id || '',
      notes: event.notes || billData.notes || '',
    }
    const res = event._id ? 
      // 修改
      await collection.doc(event._id).update({
        data: {
          ...newBill
        }
      }) : 
      // 新增
      await collection.add({
        data: {
          ...newBill
        }
      })
    const _id = event._id || res._id
    return {
      success: true,
      data: _id
    }
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}
