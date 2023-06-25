// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command
const accountCollection = db.collection('account');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    if(!event.account_book_id) {
      return {
        success: false,
        errMsg: '缺少账本id',
      };
    }
    const res = await accountCollection
      .where({
        account_book_id: event.account_book_id
      })
      .get();
    return {
      success: true,
      data: res && res.data,
    };
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}