import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { accountService } from "../service/accountService";

const accountStore = observable({
  async getAccountList(params) {
    let res = await accountService.getAccountList(params)
    return res
  },
  async editAccount(params) {
    let res = await accountService.editAccount(params)
    return res
  }
});
export default accountStore;
