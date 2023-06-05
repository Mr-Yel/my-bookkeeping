import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Text, Image, Button, Input, NavigationBarTitle } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { DEFAULT_HEADER } from '../../config'
import { MyPage } from '../../components'
import { routerGoIn } from '../../utils/router'


@inject('BillStore', 'UserStore')
@observer
export default class userInfoEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openNameEdit: false,
      name: '',
      copyName: '',
      picture: '',
    };
  }

  componentWillMount () {
    const { UserStore: { userInfo } } = this.props
    this.setState({ ...userInfo })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goToEditUserInfo = () => {
    routerGoIn(`/pages/userInfoEdit/userInfoEdit`);
  }

  editUserName = () => {
    const { name } = this.state
    this.setState({
      copyName: name,
      openNameEdit: true
    })
  }

  setUserInfo = async (e, type) => {
    const { UserStore } = this.props
    switch (type) {
      case 'picture':
        const picture = e && e.detail && e.detail.avatarUrl || ''
        let res = await UserStore.setUserInfo({ picture })
        if(res && res.success) {
          this.setState({ picture: picture })
        }
        break;
      case 'name':
        const { copyName } = this.state
        this.setState({ name: copyName })
        await UserStore.setUserInfo({ name: copyName })
        this.setState({ openNameEdit: false })
        break;
    }
  }

  onChange = (e, type) => {
    switch (type) {
      case 'copyName':
        const val = e && e.detail && e.detail.value
        this.setState({ copyName: val })
        break;
    }
  }

  render () {
    const { openNameEdit, picture, name, copyName } = this.state
    return (
      <View className='userInfoEdit'>
        <MyPage
          canGoBack
          titleContent='我的'
        >
          <View className='edit'>
            <View className='user_image'>
              <Button
                className='button'
                openType='chooseAvatar'
                onChooseAvatar={(e) => this.setUserInfo(e, 'picture')}
                style={`backgroundImage:url(${picture || DEFAULT_HEADER});`}
              ></Button>
            </View>
            <View className='edit-item'>
              <Text>昵称</Text>
              <View onClick={this.editUserName}>
                <Text className='user_name'>{name}</Text>
                <Text className='iconfont icon-enter'></Text>
              </View>
            </View>
          </View>
          {openNameEdit && <View className='mark-edit-name'>
            <View className='mark' onClick={() => this.setState({ openNameEdit: false })}></View>
            <View className='mark-edit-name-content'>
              <View className='mark-edit-name-title'>更换昵称</View>
              <Input
                focus
                value={copyName}
                className='mark-edit-name-input'
                type='text'
                placeholder='请输入昵称'
                maxLength='10'
                onInput={e => { this.onChange(e, 'copyName') }}
              />
              <View className='mark-edit-name-box'>
                <Text className='mark-edit-name-cancel' onClick={() => this.setState({ openNameEdit: false })}>取消</Text>
                <Text className='mark-edit-name-sure' onClick={(e) => this.setUserInfo(e, 'name')}>确定</Text>
              </View>
            </View>
          </View>}
        </MyPage>
      </View>
    )
  }
}
