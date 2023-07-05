// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

const _ = db.command 

const usersAccountBookBillTypesCollection = db.collection('users_or_account_book_bill_types')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const { list, type } = event
    if(list && list.length) {
      // 根据id数组顺序更新sort字段的值
      for(let i=0;i<list.length;i++) {
        await usersAccountBookBillTypesCollection.where({
          bill_type_id: list[i].id,
          bill_type: type
        }).update({
          data: {
            sort: list[i].sort
          }
        })
      }
    }
    return {
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
