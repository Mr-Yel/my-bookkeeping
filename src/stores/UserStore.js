import Taro from '@tarojs/taro'
import { observable } from 'mobx'
import { service } from '../service'
import httpService from '../service/httpService'
import { storage } from '../utils/storage'
import { uploadAvatar } from '../utils/index'
import { accountService } from '../service/accountService'

const UserStore = observable({
  userInfo: {
    name: '',
    openId: '',
    picture: ''
  },
  setSysData: {
    statusBarHeight: 0
  },
  accountBookList: [],
  curAccountBook: {},
  async getUserInfo(callback) {

    // this.testFn()

    storage
      .get('userInfo')
      .then((res) => {
        this.userInfo = res
        callback && callback()
      })
      .catch(async (error) => {
        console.log(error)
        let res = await service.getUserInfo()
        if (res && res.success) {
          storage.set('userInfo', res.data)
          this.userInfo = res.data
          callback && callback()
        }
      })
  },
  async setUserInfo(data) {
    console.log('data',data);
    let userInfo = Object.assign(this.userInfo, data)
    let res = {}
    if (Object.keys(data).includes('picture')) {
      let avatar = await uploadAvatar(data)
      Object.assign(userInfo, { picture: avatar })
    }
    res = await service.setUserInfo(userInfo)
    if (res && res.success) {
      storage.set('userInfo', res.data)
    }
    return res
  },
  getSysInfo() {
    const info = Taro.getSystemInfoSync()
    const setSysData = {
      ...info
    }
    this.setSysData = setSysData
  },
  async getAccountBookList() {
    try {
      let res = await accountService.getAccountBookList()
      if (res && res.success) {
        this.accountBookList = res.data
        this.curAccountBook = res.data.find(e=>e.is_cur_account_book)
      }
    } catch (err) {
      console.log(err)
    }
  },


  async testFn() {
    let res = await httpService.request({
      name: 'editBill',
      data: {
        '_id':'9e70c665648bd870021f37cb16668cc3',
        'amount': 11,
        'notes': '测试',
      }
    }, true)
    console.log('testFntestFn',res);
  }
})
export default UserStore
