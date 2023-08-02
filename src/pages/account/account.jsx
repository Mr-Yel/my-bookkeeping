import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoIn } from '@/utils/router'
import { MyPage, MyIcon } from '@/components'
import { DEFAULT_ACCOUNT_BOOK_BG } from '@/config'

@inject('AccountStore')
@observer
export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = { }
  }

  componentWillMount () {
    // this.fetchData()
    Taro.eventCenter.on('accountList:refresh', this.refreshData)
    Taro.eventCenter.on('removeBill:success', this.refreshData)
    Taro.eventCenter.on('addBill:success', this.refreshData)
  }

  componentDidMount () { }

  componentWillUnmount () {
    Taro.eventCenter.off('accountList:refresh', this.refreshData)
    Taro.eventCenter.off('removeBill:success', this.refreshData)
    Taro.eventCenter.off('addBill:success', this.refreshData)
  }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async () => {
    const { AccountStore } = this.props
    await AccountStore.getAccountList()
  }

  refreshData = () => {
    this.fetchData()
  }

  addAccount = () => {
    routerGoIn(`/pages/addAccount/addAccount`);
  }

  handelClick = (item) => {
    routerGoIn(`/pages/addAccount/addAccount?account_id=${item && item._id}`);
  }

  render () {
    const { AccountStore: { accounts } } = this.props
    const header = <View>
      账户资产
    </View>

    const totalAssets = accounts && accounts.filter(e=>e.property>0).reduce((x,y)=>x+(+y.property),0)
    const totalLiabilities = accounts && accounts.filter(e=>e.property<0).reduce((x,y)=>x+(+y.property),0)

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
            <View className='balance-num'>{totalAssets+totalLiabilities}</View>
          </View>
          <View className='account-sum'>
            <View className='account-outcome'>
              <View>总资产(元)</View>
              <View className='outcome-num'>{totalAssets}</View>
            </View>
            <View className='account-income'>
              <View>总负债(元)</View>
              <View className='income-num'>{-totalLiabilities}</View>
            </View>
          </View>
        </View>
        <View className='account-list'>
          <View className='account-item'>我的账户</View>
          {accounts && !!accounts.length && accounts.map((item, index) => <View
            key={index}
            onClick={() => this.handelClick(item)}
            className='account-item'
          >
            <Image src={item.account_img || DEFAULT_ACCOUNT_BOOK_BG}></Image>
            <Text className='account-name'>{item.name}</Text>
            <Text className='account-property'>{item.property}</Text>
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
