import Taro from '@tarojs/taro'
import { observable } from 'mobx'
import { service } from '../service'
import { storage } from '../utils/storage'
import { uploadAvatar } from '../utils/index'

const UserStore = observable({
  userInfo: {
    name: '',
    openId: '',
    picture: ''
  },
  setSysData: {
    statusBarHeight: 0
  },
  async getUserInfo(callback) {
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
  }
})
export default UserStore
