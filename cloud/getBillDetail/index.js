// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');
cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const billsCollection = db.collection('bills');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const { _id } = event
    if(!_id || typeof _id != 'string') {
      return {
        msg: '_id 不存在或者格式有误',
        success: false,
      }
    }
    const res = await billsCollection.aggregate()
      .match({
        _id: _id,
      })
      .lookup({
        from: 'bill_types',
        localField: 'bill_type_id',
        foreignField: '_id',
        as: 'bill_type_info'
      })
      .addFields({
        'bill_type': {
          '_id': {
            $arrayElemAt: ['$bill_type_info._id', 0]
          },
          'bill_type_name': {
            $arrayElemAt: ['$bill_type_info.bill_type_name', 0]
          },
          'bill_type_icon': {
            $arrayElemAt: ['$bill_type_info.bill_type_icon', 0]
          },
          'bill_type': {
            $arrayElemAt: ['$bill_type_info.bill_type', 0]
          },
          'bill_type_color': {
            $arrayElemAt: ['$bill_type_info.bill_type_color', 0]
          },
        }
      })
      .project({
        bill_type_info: 0,
        bill_type_id: 0
      })
      .lookup({
        from: 'account',
        localField: 'account_id',
        foreignField: '_id',
        as: 'account_info'
      })
      .addFields({
        'account': {
          '_id': {
            $arrayElemAt: ['$account_info._id', 0]
          },
          'name': {
            $arrayElemAt: ['$account_info.name', 0]
          }
        }
      })
      .project({
        account_info: 0,
        account_id: 0
      })
      .end();

    return {
      data: res && res.list && res.list[0] || {},
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