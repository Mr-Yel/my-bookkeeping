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
    const accountsCollection = db.collection('account')
    let accountData = {}
    if(event.account_id) {
      let accountRes = await accountsCollection.doc(event.account_id).get()
      if(accountRes && accountRes.data) {
        accountData = accountRes.data
      }
    }
    const newAccount = {
      account_book_id: event.account_book_id || accountData.account_book_id || '',
      account_img: event.account_img || accountData.account_img || '',
      name: event.name || accountData.name || '',
      property: +event.property || +accountData.property || 0,
    }
    const res = event.account_id ? 
      // 修改
      await accountsCollection.doc(event.account_id).update({
        data: {
          ...newAccount
        }
      }) : 
      // 新增
      await accountsCollection.add({
        data: {
          ...newAccount
        }
      })
    const _id = event.account_id || res._id
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