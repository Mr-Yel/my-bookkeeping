// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log((event, context));
  try {
    const collection = db.collection('users')
    console.log('这是openid', openid);
    const res = await collection.where({
      openid: openid
    }).get()
    console.log('这是openid的查询结果', res);
    if(res && res.data && res.data.length) {
      // openid 为每个用户的唯一标识，一定是唯一的
      // 存在用户数据
      const userData = Object.assign(res.data[0], event)
      const _id = res.data[0]._id
      delete userData._id
      const updateRes = await collection.doc(_id).update({
        data: {
          ...userData,
        }
      })
      console.log('updateRes',updateRes);
      if(updateRes && updateRes.stats && updateRes.stats.updated == 1) {
        return {
          msg: '修改成功',
          success: true,
          data: userData
        }
      }else {
        return {
          errMsg: '修改失败',
          success: false
        }
      }
     
    }else {
      return {
        errMsg: '修改失败',
        success: false,
      }
    }
  } catch (err) {
    console.log(err)
    return {
      errMsg: err.errMsg,
      success: false,
    }
  }
}