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
    * bill_type String 账单类型,
    * bill_types_use_by  1 使用个人关联的类型 2 使用账本关联的类型
    */
    const { bill_type, bill_types_use_by, account_book_id } = event

    const billTypesUseBy = bill_types_use_by || 1 // 默认 使用个人关联的类型

    let usersOrAccountBookBillTypesRes = null
    if(billTypesUseBy === 1) {
      // 使用个人关联的类型
      usersOrAccountBookBillTypesRes = await usersOrAccountBookBillTypesCollection.where({
        openid,
        bill_type,
      }).orderBy('sort', 'asc').get()  // orderBy 方法按 sort 从小到大排序
    } else if (billTypesUseBy === 2) {
      // 使用账本关联的类型
      usersOrAccountBookBillTypesRes = await usersOrAccountBookBillTypesCollection.where({
        account_book_id,
        bill_type,
      }).orderBy('sort', 'asc').get()  // orderBy 方法按 sort 从小到大排序
    } else {
      throw new Error('不支持的bill_types_use_by类型')
    }

    console.log(usersOrAccountBookBillTypesRes);

    const typeIds = usersOrAccountBookBillTypesRes.data.map(e=>e.bill_type_id)

    const getBillTypeByIdsRes = await billTypesCollection.where({
      _id: db.command.in(typeIds)
    }).get();

    console.log(getBillTypeByIdsRes.data);

    const sortedResult = typeIds.map(id => getBillTypeByIdsRes.data.find(item => item._id === id));

    return {
      success: true,
      data: sortedResult
    }
    
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}