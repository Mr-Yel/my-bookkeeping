import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { DEFAULT_HEADER } from '../../config'
import { MyPage, MyIcon } from '../../components'
import { routerGoIn } from '../../utils/router'

@inject('BillStore', 'UserStore')
@observer
export default class User extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  goToEditUserInfo = () => {
    routerGoIn(`/pages/userInfoEdit/userInfoEdit`)
  }

  goCategory = () => {
    routerGoIn(`/pages/billCategory/billCategory`)
  }

  goBudgetEdit = () => {
    routerGoIn(`/pages/budgetEdit/budgetEdit`)
  }

  warnToast = () => {
    Taro.showToast({
      title: '待开发功能，尽情期待',
      icon: 'none',
    })
  }

  render() {
    const {
      UserStore: { userInfo }
    } = this.props

    const customPlateContent = (
      <View className='user-bar'>
        <Image className='user_image' src={(userInfo && userInfo.picture) || DEFAULT_HEADER}></Image>
        <View className='user_name' onClick={this.goToEditUserInfo}>
          <Text>{(userInfo && userInfo.name) || '默认用户'}</Text>
          <MyIcon name='enter'></MyIcon>
        </View>
      </View>
    )
    const customFunctionContent = (
      <view className='function-bar'>
        <view className='function-title-bar'>
          <Text className='function-title-bar-title'>功能服务</Text>
          <Text className='function-title-bar-tips'>这是一条提示</Text>
        </view>
        <view className='function-list'>
          <view className='function-list-item' onClick={this.goCategory}>
            <MyIcon name='yingyong'></MyIcon>
            <Text className='function-list-name'>分类管理</Text>
          </view>
          <view className='function-list-item' onClick={this.goBudgetEdit}>
            <MyIcon name='budget-1'></MyIcon>
            <Text className='function-list-name'>预算管理</Text>
          </view>
          <view className='function-list-item' onClick={this.warnToast}>
            <MyIcon name='contact-1'></MyIcon>
            <Text className='function-list-name'>联系作者</Text>
          </view>
        </view>
      </view>
    )

    return (
      <View className='User'>
        <MyPage titleContent='我的'>
          <View className='bills-title-bg'></View>
          {customPlateContent}
          {customFunctionContent}
        </MyPage>
      </View>
    )
  }
}
