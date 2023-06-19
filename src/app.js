import Taro from "@tarojs/taro";
import { Component } from 'react'
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
    // await UserStore.getUserInfo()
    // await UserStore.getAccountList()  // 获取用户账户列表
    AccountStore.getAccountList()   // 获取用户账单
    await UserStore.getSysInfo()
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    // this.props.children 是将要会渲染的页面
    return <Provider MyIcon={MyIcon} {...stores}>{this.props.children}</Provider>;
  }
}

export default App
