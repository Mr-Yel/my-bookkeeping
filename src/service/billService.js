import httpService from './httpService'

export const billService = {
  getBillsList: async (data) => {
    return await httpService.request(
      {
        name: 'getBillsList',
        data
      },
      true
    )
  },

  getBillTypes: async (data) => {
    return await httpService.request(
      {
        name: 'getBillTypes',
        data
      },
      true
    )
  },

  getBillDetail: async (data) => {
    return await httpService.request(
      {
        name: 'getBillDetail',
        data
      },
      true
    )
  },

  editBill: async (data) => {
    return await httpService.request(
      {
        name: 'editBill',
        data
      },
      true
    )
  },

  removeBill: async (data) => {
    return await httpService.request(
      {
        name: 'removeBill',
        data
      },
      true
    )
  }
}
