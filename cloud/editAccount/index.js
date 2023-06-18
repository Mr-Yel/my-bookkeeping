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
    const newAccount = {
      account_book_id: event.account_book_id || '',
      account_img: event.account_img || '',
      name: event.name || '',
      property: event.property == undefined ? '' : event.property,
    }
    const res = await accountsCollection.add({
      data: {
        ...newAccount
      }
    })
    const { _id } = res
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
