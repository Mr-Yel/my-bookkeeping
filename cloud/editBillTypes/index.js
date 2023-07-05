// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

const billTypesCollection = db.collection('bill_types')

const usersAccountBookBillTypesCollection = db.collection('users_or_account_book_bill_types')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const { bill_type, bill_type_color, bill_type_icon, bill_type_name } = event
    const billTypeData = {}
    if(event._id) {
      let billListRes = await billTypesCollection.doc(event._id).get()
      if(billListRes && billListRes.list && billListRes.list[0]) {
        billTypeData = billListRes.list[0]
      }
    }
    const newBillType = {
      bill_type: bill_type || billTypeData.bill_type || '',
      bill_type_color: bill_type_color || billTypeData.bill_type_color || '',
      bill_type_icon: bill_type_icon || billTypeData.bill_type_icon || '',
      bill_type_name: bill_type_name || billTypeData.bill_type_name || '',
      is_base_bill_type: false,
    }
    const res = event._id ? 
      // 修改
      await billTypesCollection.doc(event._id).update({
        data: {
          ...newBillType
        }
      }) : 
      // 新增
      await billTypesCollection.add({
        data: {
          ...newBillType
        }
      })
    if(!event._id) {
      const sortRes = await usersAccountBookBillTypesCollection
        .where({openid: openid})
        .orderBy('sort', 'desc')
        .limit(1)
        .get();
      const maxSort = sortRes.data.length > 0 ? sortRes.data[0].sort : 0;
      // 新增
      await usersAccountBookBillTypesCollection.add({
        data: {
          openid: openid,
          bill_type: bill_type || 'no_type',
          bill_type_id: res._id,
          is_base_bill_type: false,
          sort: maxSort + 1,
        }
      })
    }
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
