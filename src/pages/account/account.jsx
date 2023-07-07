import dayjs from 'dayjs'
import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoIn } from '@/utils/router'
import { MyPage, MyIcon } from '@/components'
import { AmountType } from '@/enum'
import { DEFAULT_ACCOUNT_BOOK_BG } from '@/config'

@inject('AccountStore')
@observer
export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accountDetail: [],
    }
  }

  componentWillMount () {
    this.fetchData()
    Taro.eventCenter.on('accountList:refresh', this.refreshData)
    Taro.eventCenter.on('removeBill:success', this.refreshData)
  }

  componentDidMount () { }

  componentWillUnmount () {
    Taro.eventCenter.off('accountList:refresh', this.refreshData)
    Taro.eventCenter.on('removeBill:success', this.refreshData)
  }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async () => {
    const { AccountStore } = this.props
    
    const res = await AccountStore.getAccountList()
    if (res && res.success) {
      let accountDetail = res.data
      this.setState({ accountDetail })
    }
  }

  refreshData = () => {
    this.fetchData()
  }

  addAccount = () => {
    routerGoIn(`/pages/addAccount/addAccount`);
  }

  render () {
    const { accountDetail } = this.state
    const header = <View>
      账户资产
    </View>

    return (
      <MyPage
        className='Account'
        titleContent={header}
        showBg
      >
        <View className='account-title-bg'></View>
        <View className='account-title'>
          <View className='account-title-balance'>
            <View>净资产(元)</View>
            <View className='balance-num'>{12}</View>
          </View>
          <View className='account-sum'>
            <View className='account-outcome'>
              <View>总资产(元)</View>
              <View className='outcome-num'>{12}</View>
            </View>
            <View className='account-income'>
              <View>总负债(元)</View>
              <View className='income-num'>{12}</View>
            </View>
          </View>
        </View>
        <View className='account-list'>
          <View className='account-item'>我的账户</View>
          {accountDetail && !!accountDetail.length && accountDetail.map((item, index) => <View
            key={index}
            onClick={() => this.handelClick(item)}
            className='account-item'
          >
            <Image src={item.account_img || DEFAULT_ACCOUNT_BOOK_BG}></Image>
            {item.name}
          </View>)}
          <View
            className='account-add'
            onClick={this.addAccount}
          >
            添加账户<MyIcon name='add-1'></MyIcon>
          </View>
        </View>
      </MyPage>
    )
  }
}
