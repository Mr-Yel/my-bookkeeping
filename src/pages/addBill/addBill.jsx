import dayjs from 'dayjs'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon, CustomSoftKeyboard } from '../../components'
import { routerGoBack } from '../../utils/router'

const enumBillType = {
  out: 0,
  in: 1,
  0: 'out',
  1: 'in'
}

@inject('BillStore', 'UserStore')
@observer
export default class addBill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      billTypes: [[], []],
      curBillTypes: [{}, {}],
      curBillTab: 0
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  get curBillType() {
    const { curBillTab, curBillTypes } = this.state
    return curBillTypes[curBillTab]
  }

  set curBillType(value) {
    const { curBillTab, curBillTypes } = this.state
    curBillTypes[curBillTab] = value
    this.setState({ curBillTypes })
  }

  fetchData = async (type = 'out') => {
    const { BillStore } = this.props
    const { billTypes, curBillTypes } = this.state
    const params = {
      bill_type: type
    }
    const { router } = getCurrentInstance()
    const res = await BillStore.getBillTypes(params)
    if (res && res.success) {
      if (res.data && res.data.length == 0) {
        await Taro.showModal({
          title: '账单类别为空，请先添加账单类别',
          showCancel: false,
          confirmColor: '#000',
          confirmText: '我知道了',
          success: () => {
            routerGoBack()
          }
        })
        return
      }
      billTypes[enumBillType[type]] = res.data
      curBillTypes[enumBillType[type]] = res.data[0]
      this.setState({
        curBillTab: enumBillType[type],
        billTypes,
        curBillTypes
      })
    }
    if (router.params.id) {
      const bill = await BillStore.getBillDetail({ _id: router.params.id })
      if (bill && bill.success) {
        const { data } = bill
        this.curBillType = data.bill_type
        this.CustomSoftKeyboard.updateValue({ notes: data.notes, amount: data.amount })
      }
    }
  }

  billTypeOnClick = (item) => {
    if (this.curBillType._id == item._id) return
    this.curBillType = item
  }

  changeBillType = (type) => {
    const { curBillTab, billTypes } = this.state
    if (enumBillType[type] == curBillTab) return
    if (billTypes[enumBillType[type]] && billTypes[enumBillType[type]].length) {
      this.setState({ curBillTab: enumBillType[type] })
      return
    }
    this.fetchData(type)
  }

  isComplete = async (data) => {
    const {
      BillStore,
      UserStore: { curAccountBook }
    } = this.props
    const { router } = getCurrentInstance()
    const params = {
      notes: (data && data.notes) || '',
      amount: (data && data.amount) || 0,
      bill_type_id: this.curBillType._id,
      date_time: dayjs(data.date + data.time).format('YYYYMMDDHHmmss'),
      account_book_id: data.accountBook && data.accountBook._id,
      account_id: curAccountBook._id
    }
    if (router.params.id) params._id = router.params.id
    const res = await BillStore.editBill(params)
    if (res && res.success) {
      console.log(res)
      Taro.eventCenter.trigger('homeList:refresh')
      routerGoBack()
    }
  }

  render() {
    const { billTypes, curBillTab } = this.state
    const tabs = (
      <View className='tabs'>
        <View className='tabs-item' onClick={() => this.changeBillType('out')}>
          支出
        </View>
        <View className='tabs-item' onClick={() => this.changeBillType('in')}>
          收入
        </View>
        <View className='tabs-item' onClick={() => this.changeBillType('in')}>
          转账
        </View>
      </View>
    )
    return (
      <View className='addBill'>
        <MyPage canGoBack titleContent='我的'>
          {tabs}
          <View className='content'>
            {billTypes &&
              billTypes[curBillTab] &&
              billTypes[curBillTab].map((item) => (
                <View key={item._id} className='amount-type-item' onClick={() => this.billTypeOnClick(item)}>
                  <View
                    className={`amount-type-icon ${item._id == this.curBillType._id ? 'active' : ''}`}
                    style={`backgroundColor: ${item._id == this.curBillType._id ? item.bill_type_color : '#FFF'}`}
                  >
                    <MyIcon name={item.bill_type_icon}></MyIcon>
                  </View>
                  <Text className='amount-type-name'>{item.bill_type_name}</Text>
                </View>
              ))}
          </View>

          <View className='footer'>
            <CustomSoftKeyboard isComplete={(e) => this.isComplete(e)} ref={this.CustomSoftKeyboard}></CustomSoftKeyboard>
          </View>
        </MyPage>
      </View>
    )
  }
}
