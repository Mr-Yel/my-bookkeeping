import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { accountService } from "../service/accountService";

const accountStore = observable({
  async getAccountBookList(params) {
    let res = await accountService.getAccountBookList(params)
    return res
  }
});
export default accountStore;
