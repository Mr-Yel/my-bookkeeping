// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    const collection = db.collection('bills')
    const newBill = {
      amount: event.amount,
      bill_type_id: event.bill_type_id,
      date_time: dayjs(event.date_time).toDate(),
      from_book: event.from_book,
      note_taker: event.note_taker,
      notes: event.notes,
    }
    const res = await collection.add({
      data: {
        ...newBill
      }
    })
    collection.orderBy('index', 'desc').limit(1).get({
      success: res => {
        const maxIndex = res.data.length ? res.data[0].index : -1
        // 将新文档的序号设置为最大值加一
        newDoc.index = maxIndex + 1
        // 插入新文档
        collection.add({
          data: newDoc,
          success: res => {
            console.log('新文档插入成功')
          },
          fail: err => {
            console.error('新文档插入失败', err)
          }
        })
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
