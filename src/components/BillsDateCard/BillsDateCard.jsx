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

  openActionSheet = (bill_id) => {
    Taro.showActionSheet({
      itemList: ['编辑账单', '删除账单'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            routerGoIn(`/pages/addBill/addBill?id=${bill_id}`)
            break
          case 1:
            console.log('删除账单')
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
            <View key={index} className='bill-card-item' onClick={() => this.openActionSheet(item._id)}>
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
