import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Button, Input } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon } from '../../components'
import { routerGoBack } from '../../utils/router'
import dayjs from "dayjs";

@inject('AccountStore', 'UserStore')
@observer
export default class addAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentWillMount () { }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  setAccountInfo = (e, type) => {
    console.log(e, type);
  }

  render () {
    const { picture } = this.state

    return (
      <View className='addAccount'>
        <MyPage
          canGoBack
          titleContent='添加账户'
        >
          <View className='account_image'>
            <Button
              className='button'
              openType='getPhoneNumber'
              onChooseAvatar={(e) => this.setAccountInfo(e, 'picture')}
              // style={`backgroundImage:url(${picture});`}
            ></Button>
          </View>
         
        </MyPage>
      </View>
    )
  }
}
