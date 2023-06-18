import httpService from './httpService'

export const service = {
  getUserInfo: async () => {
    return await httpService.request({
      name: 'login',
    }, false)
  },

  setUserInfo: async (data) => {
    return await httpService.request({
      name: 'setUserInfo',
      data
    }, true)
  },
}