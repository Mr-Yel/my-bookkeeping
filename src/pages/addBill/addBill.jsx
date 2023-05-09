import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon, CustomSoftKeyboard } from '../../components'
import { routerGoBack } from '../../utils/router'
import dayjs from "dayjs";

const enumBillType = {
  'out': 0,
  'in': 1,
  0: 'out',
  1: 'in',
}

@inject('BillStore', 'UserStore')
@observer
export default class addBill extends Component {

  constructor(props) {
    super(props);
    this.state = {
      billTypes: [[],[]],
      curBillTypes: [{},{}],
      curBillTab: 0,
    };
  }

  componentWillMount () { }

  componentDidMount () {
    this.fetchData()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  get curBillType() {
    const { curBillTab, curBillTypes } = this.state
    return curBillTypes[curBillTab]
  }

  set curBillType(value) {
    const { curBillTab, curBillTypes } = this.state
    curBillTypes[curBillTab] = value
    this.setState({ curBillTypes });
  }

  fetchData = async (type = 'out') => {
    const { BillStore } = this.props
    const { billTypes, curBillTypes } = this.state
    const params = {
      bill_type: type,
    }
    const res = await BillStore.getBillTypes(params)
    if (res && res.success) {
      if(res.data && res.data.length == 0) {
        await Taro.showModal({
          title: '账单类别为空，请先添加账单类别',
          showCancel: false,
          confirmColor: "#000",
          confirmText: '我知道了',
          success: () => {
            routerGoBack()
          }
        });
        return
      }
      billTypes[enumBillType[type]] = res.data
      curBillTypes[enumBillType[type]] = res.data[0]
      this.setState({ 
        curBillTab: enumBillType[type],
        billTypes,
        curBillTypes,
      })
      
    }
  }

  billTypeOnClick = (item) => {
    if(this.curBillType._id == item._id) return
    this.curBillType = item
  }

  changeBillType = (type) => {
    const { curBillTab, billTypes } = this.state
    if(enumBillType[type] == curBillTab) return
    if(billTypes[enumBillType[type]] && billTypes[enumBillType[type]].length) {
      this.setState({curBillTab: enumBillType[type]})
      return
    }
    this.fetchData(type)
  }

  isComplete = async (data) => {
    const { BillStore, UserStore: { userInfo } } = this.props
    const params = {
      notes: data && data.notes || '',
      amount: data && data.amount || 0,
      bill_type_id: this.curBillType._id,
      date_time: dayjs().format("YYYYMMDDHHmmss"),
      from_book: '00d42a4c641bc93f0007931a2353b255', // TODO 账本
      note_taker: userInfo && userInfo._id,
    }
    const res = await BillStore.editBill(params)
    if(res && res.success) {
      console.log(res);
      Taro.eventCenter.trigger('addBill:success');
      routerGoBack()
    }
  }

  render () {
    const { billTypes, curBillTab } = this.state
    const tabs = <View className='tabs'>
      <View className='tabs-item' onClick={()=>this.changeBillType('out')}>支出</View>
      <View className='tabs-item' onClick={()=>this.changeBillType('in')}>收入</View>
      <View className='tabs-item' onClick={()=>this.changeBillType('in')}>转账</View>
    </View>
    return (
      <View className='addBill'>
        <MyPage
          titleContent='我的'
        >
          {tabs}
          <View className='content'>
            {billTypes && billTypes[curBillTab] && billTypes[curBillTab].map(item =>
              <View 
                key={item._id} 
                className='amount-type-item'
                onClick={()=>this.billTypeOnClick(item)}
              >
                <View 
                  className={`amount-type-icon ${item._id == this.curBillType._id ? 'active' : ''}`}
                  style={`backgroundColor: ${item._id == this.curBillType._id ? item.bill_type_color : '#FFF'}`}
                >
                  <MyIcon name={item.bill_type_icon}></MyIcon>
                </View>
                <Text className='amount-type-name'>{item.bill_type_name}</Text>
              </View>)}
          </View>

          <View className='footer'>
            <CustomSoftKeyboard isComplete={(e)=>this.isComplete(e)}></CustomSoftKeyboard>
          </View>
        </MyPage>
      </View>
    )
  }
}
