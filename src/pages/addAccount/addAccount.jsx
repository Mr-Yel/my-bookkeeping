import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Button, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { DEFAULT_ACCOUNT_BOOK_BG } from '@/config'
import { MyPage } from '@/components'
import { FormInput } from '@/components/Form'
import { uploadAvatar } from '@/utils'
import { routerGoBack } from '@/utils/router'

@inject('AccountStore', 'UserStore')
@observer
export default class addAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountBg: DEFAULT_ACCOUNT_BOOK_BG,
      name: '',
      property: 0,
    };
  }

  componentWillMount () { }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  saveAccountBook = async () => {
    const { AccountStore } = this.props
    const { accountBg, name, property } = this.state
    if(!name) {
      Taro.showToast({
        title: '请填写账本名称',
        icon: 'none'
      })
      return
    }
    const params = {
      account_img: accountBg,
      name,
      property,
    }
    let res = await AccountStore.editAccount(params)
    if(res && res.success) {
      console.log(res);
      routerGoBack()
      Taro.eventCenter.trigger('accountList:refresh');
    }
  }

  onChange = async (type, e) => {
    // console.log(type, e);
    switch(type) {
      case 'accountBg':
        console.log(e);
        const picture = e && e.detail && e.detail.avatarUrl || ''
        let img = await uploadAvatar({ picture })
        this.setState({accountBg: img})
        break;
      default:
        const value = e.detail.value
        // console.log(value);
        this.setState({[type]: value})
        break;
    }
  }

  render () {
    const { accountBg, name, property } = this.state

    return (
      <View className='addAccount'>
        <MyPage
          canGoBack
          titleContent='添加账本'
        >
          <View>
            <View className='edit_content'>
              <Button
                className='button'
                openType='chooseAvatar'
                onChooseAvatar={(e) => this.onChange('accountBg', e)}
                style={`backgroundImage:url(${accountBg || DEFAULT_ACCOUNT_BOOK_BG});`}
              >
                <Image className='image' src={accountBg || DEFAULT_ACCOUNT_BOOK_BG}></Image>
              </Button>
              <FormInput
                label='账本名称：'
                maxLength='50'
                value={name}
                onChange={(e) => this.onChange('name', e)}
              ></FormInput>
              <FormInput
                label='账本余额：'
                maxLength='50'
                type='number'
                value={property}
                onChange={(e) => this.onChange('property', e)}
              ></FormInput>
            </View>
            <View className='default-button-box'>
              <Button onClick={this.saveAccountBook} className='primary'>保存</Button>
            </View>
          </View>
         
        </MyPage>
      </View>
    )
  }
}
