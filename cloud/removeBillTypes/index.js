// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const billTypesCollection = db.collection('bill_types');
const usersOrAccountBookBillTypesCollection = db.collection('users_or_account_book_bill_types');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    /*
    * ids Array 账单类型 id 数组,
    */
    const { ids } = event

    if(!ids || (ids && !ids.length)) {
      return {
        errMsg: '未传入 ids',
        success: false,
      }
    }
    
    const usersOrAccountBookBillTypesRes = await usersOrAccountBookBillTypesCollection.where({
      bill_type_id: _.in(ids)
    }).get()

    if(usersOrAccountBookBillTypesRes && usersOrAccountBookBillTypesRes.data) {
      const canRemoveBillTypes = usersOrAccountBookBillTypesRes.data.filter(e=>!e.is_base_bill_type)
    
      await usersOrAccountBookBillTypesCollection.where({
        bill_type_id: _.in(ids)
      }).remove()
    
      await billTypesCollection.where({
        _id: _.in(canRemoveBillTypes)
      }).remove()

    } else {
      return {
        errMsg: '未找到 ids',
        success: false,
      }
    }


    console.log(usersOrAccountBookBillTypesRes);

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