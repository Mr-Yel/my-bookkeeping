import httpService from './httpService'

export const accountService = {
  // 获取账户列表
  getAccountList: async () => {
    return await httpService.request({
      name: 'getAccountList',
    }, true)
  },
  // 获取账本列表
  getAccountBookList: async (data) => {
    return await httpService.request({
      name: 'getAccountBookList',
      data
    }, true)
  },
}