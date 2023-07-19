import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { accountService } from "../service/accountService";

const accountStore = observable({
  accounts: [], // 账户 // 微信，支付宝。。。
  curAccount: {}, 
  accountBookList: [], // 测试账本
  curAccountBook: {},
  budget: {},

  async getAccountList(params) {
    let res = await accountService.getAccountList(params)
    if(res && res.success) {
      this.accounts = res.data
    }
    return res
  },

  async getAccountDetail(params) {
    let res = await accountService.getAccountDetail(params)
    return res
  },

  async editAccount(params) {
    let res = await accountService.editAccount(params)
    return res
  },

  async getAccountBookList() {
    try {
      let res = await accountService.getAccountBookList()
      if (res && res.success) {
        this.accountBookList = res.data
        this.curAccountBook = res.data.find(e=>e.is_cur_account_book)
      }
    } catch (err) {
      console.log(err)
    }
  },

  async getBudgetDetail(params) {
    let res = await accountService.getBudgetDetail(params)
    return res
  },

  async setBudgetProperty(params) {
    let res = await accountService.setBudgetProperty(params)
    return res
  },

  
});
export default accountStore;
