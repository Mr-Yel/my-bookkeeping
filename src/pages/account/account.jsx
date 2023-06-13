import dayjs from 'dayjs'
import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoIn } from '@/utils/router'
import { MyPage, MyIcon } from '@/components'
import { AmountType } from '@/enum'

@inject('AccountStore')
@observer
export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      billDetails: [],
    }
  }

  componentWillMount () {
    this.fetchData()
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async (refresh) => {
    const { AccountStore } = this.props
    const res = await AccountStore.getAccountBookList()
    if (res && res.success) {
      let billDetails = res.data
      this.setState({ billDetails })
    }
  }

  addAccount = () => {
    routerGoIn(`/pages/addAccount/addAccount`);
  }

  render () {
    const { billDetails } = this.state
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
          <View className='account-item'>我的账本</View>
          {billDetails && !!billDetails.length && billDetails.map((item,index)=><View
            key={index}
            onClick={()=>this.handelClick(item)}
            className='account-item'
          >
            <Image src={item.account_img}></Image>
            {item.name}
          </View>)}
          <View 
            className='account-add'
            onClick={this.addAccount}
          >
            添加账本<MyIcon name='add-1'></MyIcon>
            </View>
        </View>
      </MyPage>
    )
  }
}
