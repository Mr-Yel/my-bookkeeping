import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { accountService } from "../service/accountService";

const accountStore = observable({
  accounts: [], // 账户

  async getAccountList(params) {
    let res = await accountService.getAccountList(params)
    if(res && res.success) {
      this.accounts = res.data
    }
    return res
  },
  async editAccount(params) {
    let res = await accountService.editAccount(params)
    return res
  }
});
export default accountStore;
