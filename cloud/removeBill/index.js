// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

const billsCollection = db.collection('bills')

const accountCollection = db.collection('account')

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
    const res = await billsCollection.doc(event._id).remove()
    await setAccountProperty(event._id)
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

async function setAccountProperty ( id ) {
  const res = await billsCollection.doc(id).get()
  const billData = res.data
  const accountRes = await billsCollection.doc(billData.account_id).get()
  const account = accountRes.data
  await billsCollection.doc(billData.account_id).get()
}
