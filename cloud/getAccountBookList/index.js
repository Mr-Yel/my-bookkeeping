// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()
const _ = db.command 
const userAccountBookCollection = db.collection('users_account_book');
const accountBookCollection = db.collection('account_book');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(event);
  try {
    console.log('openid',openid);
    const userAccountBookRes = await userAccountBookCollection
      .where({
        openid: openid
      })
      .get();
      console.log('userAccountBookRes',userAccountBookRes);
    const account_book_ids = userAccountBookRes.data.map(item => item.account_book_id);

    const accountBookRes  = await accountBookCollection
      .where({
        _id: _.in(account_book_ids)
      })
      .get();
      console.log('accountBookRes',accountBookRes);

    // 在账户信息中添加 is_cur_account_book 字段
    const accounts = accountBookRes.data && accountBookRes.data.length == 0 ? 
      // 不存在账户，直接新建账户和账户用户关联表
      await newAccountBookUser(openid) :
      // 存在账户，直接返回处理后的账户数据
      accountBookRes.data.map(account => {
        const userAccount = userAccountBookRes.data.find(item => item.account_book_id === account._id)
        return {
          ...account,
          is_cur_account_book: userAccount && userAccount.is_cur_account_book
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
const newAccountBookUser = async (openid) => {
  const newAccountBook = {
    img: '',
    name: '测试账户',
  }
  const accountBookAddRes = await accountBookCollection.add({
    data: {
     ...newAccountBook
    }
  })
  if(accountBookAddRes && accountBookAddRes._id) {
    const newUserAccountBook = {
      account_book_id: accountBookAddRes._id,
      is_cur_account_book: true,
      openid: openid,
    }
    const userAccountBookAddRes = await userAccountBookCollection.add({
      data: {
       ...newUserAccountBook,
      }
    })
    const newAccountData = await accountBookCollection.doc(accountBookAddRes._id).get();
    return [{
      ...newAccountData.data,
      is_cur_account_book: true,
    }]
  } else {
    throw Error
  }
}