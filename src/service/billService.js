import httpService from './httpService'

export const billService = {
  getBillDetail: async (data) => {
    return await httpService.request({
      name: 'getBillDetail',
      data
    }, true)
  },

  getBillTypes: async (data) => {
    return await httpService.request({
      name: 'getBillTypes',
      data
    }, true)
  },

  editBill: async (data) => {
    return await httpService.request({
      name: 'editBill',
      data
    }, true)
  },
}