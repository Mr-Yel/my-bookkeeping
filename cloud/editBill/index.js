// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

const collection = db.collection('bills')

const accountCollection = db.collection('account')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    let billData = {}
    if(event._id) {
      let billListRes = await collection.doc(event._id).get()
      if(billListRes && billListRes.data) {
        billData = billListRes.data
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
    await setAccountProperty(newBill, billData)
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

  async function setAccountProperty (newBill, oldBill ) {
    let diffAmount = 0
    if(oldBill.account_id) {
      const oldAccountRes = await accountCollection.doc(oldBill.account_id).get()
      const oldAccountData = oldAccountRes.data
      await accountCollection.doc(oldBill.account_id).update({data:{ property: oldAccountData.property-oldBill.amount }})
    }
    const newAccountRes = await accountCollection.doc(newBill.account_id).get()
    const newAccountData = newAccountRes.data
    await accountCollection.doc(newBill.account_id).update({data:{ property: newAccountData.property+newBill.amount }})
  }
}
