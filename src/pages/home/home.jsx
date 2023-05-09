import dayjs from 'dayjs'
import Taro from "@tarojs/taro";
import { Component } from 'react'
import { AtButton } from 'taro-ui'
import { View, Text, Button } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, BillsDateCard, MyIcon } from '../../components'
import { routerGoIn } from '../../utils/router'
import { AmountType } from '../../enum'

@inject('BillStore')
@observer
export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      billDetails: new Array(4).fill(undefined),
      selectTime: '202205',
      startTime: '20220501',
      endTime: '20230531',
      activeTab: 0,
      outTotal: 0,
      inTotal: 0,
    }
  }

  componentWillMount () { }

  componentDidMount () {
    this.fetchData()
    Taro.eventCenter.on('addBill:success', this.refreshData)
  }

  componentWillUnmount () { 
    Taro.eventCenter.off('addBill:success', this.refreshData)
  }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async (refresh) => {
    const { BillStore } = this.props
    const { startTime, endTime, billDetails, activeTab } = this.state
    if (billDetails[activeTab]) return
    const params = {
      start_time: startTime,
      end_time: endTime,
      bill_type: AmountType[activeTab],
    }
    const res = await BillStore.getBillDetail(params)
    if (res && res.success) {
      billDetails[activeTab] = res.data.list
      this.setState({ 
        billDetails,
        outTotal: res.data && res.data.out_total || 0,
        inTotal: res.data && res.data.in_total|| 0
      })
    }
  }

  refreshData = () => {
    this.setState({ activeTab: 0, billDetails: [] }, () => this.fetchData(true))
  }

  goToAddBill = () => {
    routerGoIn(`/pages/addBill/addBill`);
  }


  billDetailFormatChange (billDetail) {
    if (billDetail && billDetail.length) {
      billDetail = billDetail.map(e => ({ ...e, date: dayjs(e.date_time).format('YYYYMMDD') }))
      let a = billDetail.reduce((acc, curr) => {
        if (acc[curr.date]) {
          acc[curr.date].list.push(curr);
        } else {
          acc[curr.date] = { date: curr.date, list: [curr] };
        }
        return acc;
      }, {})
      const result = Object.values(a);
      result.sort((x, y) => y.date - x.date); // 按照 date 升序排序
      return result
    }
    return []
  }

  tabsChange = (index) => {
    this.setState({ activeTab: index },
      () => this.fetchData(true)
    )
  }

  getTabs = () => {
    const { activeTab } = this.state
    return <View className='tabs'>
      {['全部', '支出', '收入', '转账'].map((item, index) => <View
        className={`tabs-item ${activeTab == index ? 'active' : ''}`}
        key={index}
        onClick={() => this.tabsChange(index)}
      >{item}</View>)}
    </View>
  }

  render () {
    const { billDetails, startTime, endTime, activeTab, outTotal, inTotal, selectTime } = this.state
    const billList = this.billDetailFormatChange(billDetails[activeTab])
    const header = <View
      onClick={()=>{this.setState()}}
    >
      {dayjs(selectTime).format('YYYY-MM')}
      <MyIcon name='unfold'></MyIcon>
    </View>
    console.log('billList', billList);
    console.log(startTime, endTime);
    console.log(dayjs(startTime).format('YYYY-MM-DD'), dayjs(endTime).format('YYYY-MM-DD'));
    return (
      <MyPage
        className='Home'
        titleContent={header}
        showBg
      >
        <View className='bills-title-bg'></View>
        <View className='bills-title'>
          <View>{outTotal}</View>
          <View>{inTotal}</View><AtButton></AtButton>
        </View>
        {this.getTabs()}
        <View className='bills-list'>
          {billList && !!billList.length && billList.map((item, index) => <View
            key={index}
          >
            <BillsDateCard billCardList={item.list} date={item.date}></BillsDateCard>
          </View>)}
        </View>
        <View className='take-bill' onClick={this.goToAddBill}>记一笔</View>
      </MyPage>
    )
  }
}
