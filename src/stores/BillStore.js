import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { billService } from "../service/billService";

const billStore = observable({
  accountBooks: [],
  accountBook: {},
  accountBookId: '11',
  billList: [],

  async getBillDetail(params) {
    let res = await billService.getBillDetail(params)
    return res
  },

  async getBillTypes(params) {
    let res = await billService.getBillTypes(params)
    return res
  },

  async editBill(params) {
    let res = await billService.editBill(params)
    return res
  }
});
export default billStore;
