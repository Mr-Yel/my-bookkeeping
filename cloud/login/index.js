/* eslint-disable import/no-commonjs */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yel-bookkeeping-6gjr4iqo76b6d62b' }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    const collection = db.collection('users')
    console.log('这是openid', openid);
    const res = await collection.where({
      openid: openid
    }).get()

    console.log('这是openid的查询结果', res);

    if(res && res.data && res.data.length) {
      // openid 为每个用户的唯一标识，一定是唯一的
      // 存在用户数据，返回
      const userInfo = res.data[0]
      return {
        success: true,
        data: userInfo
      }
    }else {
      // 不存在用户信息，通过 openid 新建用户，默认的名字和头像为空
      const newUser = {
        name: '',
        picture: '',
        openid: openid,
      }
      const addRes = await collection.add({
        data: {
         ...newUser
        }
      })

      const account_book_id = await setUserDefaultAccountBook(openid)
      // 新建用户默认账本

      await setUserDefaultAccount(openid, account_book_id)
      // 新建用户默认账户 微信。。。

      await setDefaultBillType(openid, account_book_id)
      // 新建用户默认账单类型


      return {
        success: true,
        data: addRes
      }
    }
  } catch (err) {
    console.log(err)
    return {
      errMsg: err,
      success: false,
    }
  }
}

async function setUserDefaultAccountBook (openid) {
  const accountBookCollection = db.collection('account_book')
  const userAccountBookCollection = db.collection('users_account_book')
  const newAccountBook = {
    img: '',
    name: '生活账本'
  }
  
  const accountBookAddRes = await accountBookCollection.add({
    data: {
     ...newAccountBook
    }
  })

  const newAccountBookId = accountBookAddRes._id

  const newUserAccountBook = {
    account_book_id: newAccountBookId,
    is_cur_account_book: true,
    openid: openid
  }
  
  await userAccountBookCollection.add({
    data: {
     ...newUserAccountBook
    }
  })
  
  return newAccountBookId
}

async function setUserDefaultAccount (openid, account_book_id) {
  const accountCollection = db.collection('account')
  const newAccount = {
    account_book_id,
    account_book_img: '',
    name: '默认账户',
    property: 0
  }
  
  const accountAddRes = await accountCollection.add({
    data: {
     ...newAccount
    }
  })

  return accountAddRes._id
}

async function setDefaultBillType (openid, account_book_id) {
  const baseBillTypeCollection = db.collection('base_bill_types')
  const billTypeCollection = db.collection('bill_types')
  const userOrAccountBookBillTypeCollection = db.collection('users_or_account_book_bill_types')
  const baseBillTypesRes = await baseBillTypeCollection.get()
  const baseBillTypes = baseBillTypesRes.data
  for(let i in baseBillTypes) {
    const baseBillType = baseBillTypes[i]
    await userOrAccountBookBillTypeCollection.add({
      data: {
        account_book_id: account_book_id,
        bill_type: baseBillType.bill_type,
        bill_type_id: baseBillType._id,
        is_base_bill_type: true,
        openid: openid,
        sort: +i+1
      }
    })
    await billTypeCollection.add({
      data: {
        ...baseBillType,
        isAdd: true
      }
    })
  }
}