import httpService from './httpService'

export const service = {
  getUserInfo: async () => {
    return await httpService.request({
      name: 'login',
    }, true)
  },

  setUserInfo: async (data) => {
    return await httpService.request({
      name: 'setUserInfo',
      data
    })
  },
}