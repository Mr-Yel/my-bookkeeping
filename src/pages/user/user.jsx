import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
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
    // Taro.showToast({
    //   title: '待开发功能，尽情期待',
    //   icon: 'none',
    // })
    wx.openCustomerServiceConversation({});
  }

  handleContact = (e) => {
    console.log(e);
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

    const alertText = '目前为测试版本，数据随时可能会删除，如果需要长久保存请联系作者。'

    const textRunTime = Math.floor(alertText.length/5)

    const customFunctionContent = (
      <View className='function-bar'>
        <View className='function-title-bar'>
          <View className='function-title-bar-title'>提示：</View>
          <View className='function-title-bar-tips'>
            <Text style={{animationDuration: `${textRunTime}s`}}>{alertText}</Text>
          </View>
        </View>
        <View className='function-list'>
          <View className='function-list-item' onClick={this.goCategory}>
            <MyIcon name='yingyong'></MyIcon>
            <Text className='function-list-name'>分类管理</Text>
          </View>
          <View className='function-list-item' onClick={this.goBudgetEdit}>
            <MyIcon name='budget-1'></MyIcon>
            <Text className='function-list-name'>预算管理</Text>
          </View>
          <View className='function-list-item'>
            <Button openType='contact' bindcontact={this.handleContact}></Button>
            <MyIcon name='contact-2'></MyIcon>
            <Text className='function-list-name'>联系客服</Text>
          </View>
         
        </View>
      </View>
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
