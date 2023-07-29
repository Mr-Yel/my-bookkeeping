import Taro from "@tarojs/taro";
import { Component } from 'react'
import dayjs from 'dayjs'
import { Provider } from "mobx-react";
import BillStore from "./stores/BillStore";
import UserStore from "./stores/UserStore";
import AccountStore from "./stores/AccountStore";
import { MyIcon } from "./components";
import "./app.scss";

const stores = {
  BillStore,
  UserStore,
  AccountStore,
};

class App extends Component {

  async componentWillMount() {
    this.init(()=>{
      Taro.eventCenter.trigger('init:success')
    })
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  async init (callback) {
    await UserStore.getUserInfo(async ()=>{
      await AccountStore.getAccountBookList()  // 获取用户账本列表
      Promise.all[AccountStore.getAccountList()]  
        // 获取用户账单 // 获取用户账户列表
      UserStore.getSysInfo()
      callback()
    })
  }

  render () {
    // this.props.children 是将要会渲染的页面
    return <Provider MyIcon={MyIcon} {...stores}>{this.props.children}</Provider>;
  }
}

export default App
