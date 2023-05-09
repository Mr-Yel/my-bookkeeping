import Taro from "@tarojs/taro";
import { Component } from 'react'
import { Provider } from "mobx-react";
import BillStore from "./stores/BillStore";
import UserStore from "./stores/UserStore";
import { MyIcon } from "./components";
import "./app.scss";

const stores = {
  BillStore,
  UserStore
};

class App extends Component {

  async componentWillMount() {
    UserStore.getUserInfo(this.init)
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  init = () => {
    console.log('init');
    UserStore.getSysInfo()
  }

  render () {
    // this.props.children 是将要会渲染的页面
    return <Provider MyIcon={MyIcon} {...stores}>{this.props.children}</Provider>;
  }
}

export default App
