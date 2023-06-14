// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command
const accountUserCollection = db.collection('users_account');
const accountCollection = db.collection('account');

const wxContext = cloud.getWXContext()
const openid = wxContext.OPENID

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    console.log('openid',openid);
    const userAccountRes = await accountUserCollection
      .where({
        open_id: openid
      })
      .get();
      console.log('userAccountRes',userAccountRes);
    const account_ids = userAccountRes.data.map(item => item.account_id);

    const accountRes  = await accountCollection
      .where({
        _id: _.in(account_ids)
      })
      .get();
      console.log('accountRes',accountRes);

    // 在账户信息中添加 is_cur_account 字段
    const accounts = accountRes.data && accountRes.data.length == 0 ? 
      // 不存在账户，直接新建账户和账户用户关联表
      await newAccountUser(openid) :
      // 存在账户，直接返回处理后的账户数据
      accountRes.data.map(account => {
        const userAccount = userAccountRes.data.find(item => item.account_id === account._id)
        return {
          ...account,
          is_cur_account: userAccount.is_cur_account
        }
      })
      console.log('accounts',accounts);
    return {
      success: true,
      data: accounts,
    };
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}

/*
 * 新建账户以及账户用户关联
 * 返回新建成功的账户数据
 */
const newAccountUser = async (openid) => {
  const newAccount = {
    img: '',
    name: '测试账户',
  }
  const accountAddRes = await accountCollection.add({
    data: {
     ...newAccount
    }
  })
  if(accountAddRes && accountAddRes._id) {
    const newUserAccount = {
      account_id: accountAddRes._id,
      is_cur_account: true,
      open_id: openid,
    }
    const userAccountAddRes = await accountUserCollection.add({
      data: {
       ...newUserAccount,
      }
    })

    const newAccountData = await accountCollection.doc(accountAddRes._id).get();

    return [{
      ...newAccountData.data,
      is_cur_account: true,
    }]
  } else {
    throw Error
  }
}