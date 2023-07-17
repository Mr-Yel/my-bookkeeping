import httpService from './httpService'

export const accountService = {
  // 获取账户列表
  getAccountBookList: async () => {
    return await httpService.request({
      name: 'getAccountBookList',
    }, true)
  },
  // 获取账本列表
  getAccountList: async (data) => {
    return await httpService.request({
      name: 'getAccountList',
      data
    }, false)
  },
  // 修改新增账本
  editAccount: async (data) => {
    return await httpService.request({
      name: 'editAccount',
      data
    }, true)
  },
  // 获取预算详情
  getBudgetDetail: async (data) => {
    return await httpService.request({
      name: 'getBudgetDetail',
      data
    }, true)
  },
  // 修改预算
  setBudgetProperty: async (data) => {
    return await httpService.request({
      name: 'setBudgetProperty',
      data
    }, true)
  },
}