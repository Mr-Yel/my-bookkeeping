import httpService from './httpService'

export const accountService = {
  getAccountDetail: async (data) => {
    return await httpService.request({
      name: 'getAccountDetail',
      data
    }, true)
  },
}