import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { DEFAULT_HEADER } from '../../config'
import { MyNavbar, MyIcon } from '../../components'
import { routerGoIn } from '../../utils/router'

@inject('BillStore', 'UserStore')
@observer
export default class User extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goToEditUserInfo = () => {
    routerGoIn(`/pages/userInfoEdit/userInfoEdit`);
  }

  render () {
    const { UserStore: { userInfo } } = this.props
    
    const customPlateContent = <View className='user-bar'>
        <Image className='user_image' src={userInfo && userInfo.picture || DEFAULT_HEADER}></Image>
        <View className='user_name' onClick={this.goToEditUserInfo}>
          <Text>{userInfo && userInfo.name || '默认用户'}</Text>
          <MyIcon name='enter'></MyIcon>
        </View>
      </View>

    return (
      <View className='User'>
        <MyNavbar
          titleContent='我的'
          customPlateContent={customPlateContent}
        ></MyNavbar>
      </View>
    )
  }
}
