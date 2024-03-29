import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoIn } from '@/utils/router'
import { MyIcon } from '../index'

@inject('BillStore', 'UserStore')
@observer
export default class BillsDateCard extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getDate = (date) => {
    const tDate = dayjs(date)
    const format = tDate.year() == dayjs().year() ? 'MM月DD日 dddd' : 'YYYY年MM月DD日 dddd'
    return tDate.locale('zh-cn').format(format)
  }

  getTotalRecord = (billCardList) => {
    let totalIncome = 0
    let totalExpenditure = 0
    if (billCardList && billCardList.length) {
      billCardList.forEach((item) => {
        if (item.bill_type == 'in') {
          totalIncome += item.amount
        }
        if (item.bill_type == 'out') {
          totalExpenditure += item.amount
        }
      })
    }

    return {
      totalIncome,
      totalExpenditure
    }
  }

  removeBill = async  (bill_id) => {
    const { BillStore: { removeBill } } = this.props
    const res = await removeBill({_id: bill_id})
    if(res && res.success) {
      Taro.eventCenter.trigger('removeBill:success')
    }
  }

  openActionSheet = async (item) => {
    const { _id, bill_type } = item
    if (!_id || !bill_type) {
      Taro.showToast({
        title: '异常数据，请联系管理员',
        icon: 'none'
      })
    }
    Taro.showActionSheet({
      itemList: ['编辑账单', '删除账单'],
      success: async (res) => {
        switch (res.tapIndex) {
          case 0:
            routerGoIn(`/pages/addBill/addBill?id=${_id}&bill_type=${bill_type}`)
            break
          case 1:
            this.removeBill(_id)
            break
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }

  render() {
    const { billCardList, date } = this.props
    const formattedDate = this.getDate(date)
    const { totalIncome, totalExpenditure } = this.getTotalRecord(billCardList)
    return (
      <View className='BillsDateCard'>
        <View className='bill-card-title'>
          <View className='time'>{formattedDate}</View>
          <View className='sumUp'>
            {!!totalIncome && `收入: ${totalIncome}`} &nbsp;
            {!!totalExpenditure && `支出: ${totalExpenditure}`}
          </View>
        </View>
        {billCardList &&
          !!billCardList.length &&
          billCardList.map((item, index) => (
            <View key={index} className='bill-card-item' onClick={() => this.openActionSheet(item)}>
              <View className='bill-card-icon' style={`backgroundColor: ${item.bill_type_color}`}>
                <MyIcon name={item.bill_type_icon}></MyIcon>
              </View>
              <View className='bill-card-name'>
                <View className='bill-card-type-name'>{item.bill_type_name}</View>
                <View className='bill-card-notes'>{item.notes}</View>
              </View>
              <View className='bill-card-money'>
                <Text>{item.amount}</Text>
              </View>
            </View>
          ))}
      </View>
    )
  }
}
