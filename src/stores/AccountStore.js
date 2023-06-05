import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { accountService } from "../service/accountService";

const accountStore = observable({
  async getAccountDetail(params) {
    let res = await accountService.getAccountDetail(params)
    return res
  }
});
export default accountStore;
