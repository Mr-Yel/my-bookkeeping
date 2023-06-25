import Taro from '@tarojs/taro'
import { observable } from 'mobx'
import { billService } from '../service/billService'

const billStore = observable({
  accountBooks: [],
  accountBook: {},
  accountBookId: '11',
  billList: [],

  async getBillsList(params) {
    let res = await billService.getBillsList(params)
    return res
  },

  async getBillTypes(params) {
    let res = await billService.getBillTypes(params)
    console.log('getBillTypes',res);
    return res
  },

  async getBillDetail(params) {
    let res = await billService.getBillDetail(params)
    return res
  },

  async editBill(params) {
    let res = await billService.editBill(params)
    return res
  },

  async removeBill(params) {
    let res = await billService.removeBill(params)
    return res
  }
})
export default billStore
