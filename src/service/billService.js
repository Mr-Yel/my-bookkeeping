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
  },

  editBillTypes: async (data) => {
    return await httpService.request(
      {
        name: 'editBillTypes',
        data
      },
      true
    )
  },

  removeBillTypes: async (data) => {
    return await httpService.request(
      {
        name: 'removeBillTypes',
        data
      },
      true
    )
  },

  editBillTypesSort: async (data) => {
    return await httpService.request(
      {
        name: 'editBillTypesSort',
        data
      },
      true
    )
  },

  getBillTypeDetail: async (data) => {
    return await httpService.request(
      {
        name: 'getBillTypeDetail',
        data
      },
      true
    )
  }
}
