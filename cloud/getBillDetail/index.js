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
    const { start_time, end_time, bill_type } = event
    const current_date = dayjs();
    const first_date_of_month = 
      start_time ? dayjs(start_time).toDate() : current_date.startOf('month').toDate();
    const last_date_of_month = 
      end_time ? dayjs(end_time).toDate() : current_date.endOf('month').toDate();
    const billsInCurrentMonth = await getBillsInCurrentMonth(first_date_of_month, last_date_of_month, bill_type)
    const {out_total, in_total} = await getTotalAmount(first_date_of_month, last_date_of_month, bill_type)
    

    return {
      success: true,
      data: {
        list: billsInCurrentMonth && billsInCurrentMonth.list,
        out_total,
        in_total
      } 
    };
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}

const getBillsInCurrentMonth = async (first_date_of_month, last_date_of_month, bill_type) => {
  const res = await billsCollection.aggregate()
    .match({
      date_time: {
        $gte: first_date_of_month,
        $lte: last_date_of_month
      }
    })
    .lookup({
      from: 'bill_types',
      localField: 'bill_type_id',
      foreignField: '_id',
      as: 'bill_type_info'
    }) .addFields({
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
    })
    .match((bill_type === "all" || !bill_type) ? {} : { bill_type: bill_type })
    .sort({date_time: -1})
    .end();
  return res
}

const getTotalAmount =  async (first_date_of_month, last_date_of_month, bill_type) => {
  const res = await billsCollection.aggregate()
    .match({
        date_time: {
            $gte: first_date_of_month,
            $lte: last_date_of_month
        }
    })
    .lookup({
        from: 'bill_types',
        localField: 'bill_type_id',
        foreignField: '_id',
        as: 'bill_type_info'
    })
    .addFields({
        'bill_type': {
            $arrayElemAt: ['$bill_type_info.bill_type', 0]
        },
    })
    .end();
  const out_total = res.list.reduce((x,y)=>{
    if(y.bill_type == 'out') {
      x += y.amount
    }
    return x
  }, 0);
  const in_total = res.list.reduce((x,y)=>{
    if(y.bill_type == 'in') {
      x += y.amount
    }
    return x
  }, 0);
  return {
    out_total,
    in_total
  }
}