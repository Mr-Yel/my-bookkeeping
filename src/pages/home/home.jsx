import dayjs from 'dayjs'
import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Picker } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, BillsDateCard, MyIcon } from '@/components'
import { routerGoIn } from '@/utils/router'
import { AmountType } from '@/enum'

@inject('BillStore', 'UserStore', 'AccountStore')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.curTime = dayjs()

    this.state = {
      billDetails: new Array(4).fill(undefined),
      selectTime: this.curTime.format('YYYYMM'),
      activeTab: 0,
      outTotal: 0,
      inTotal: 0,
      budget: {}
    }
  }

  componentWillMount () { }

  async componentDidMount () {
    Taro.eventCenter.on('init:success', ()=>{
      this.fetchData()
      this.getBudgetDetail()
    })
    Taro.eventCenter.on('addBill:success', this.refreshData)
    Taro.eventCenter.on('removeBill:success', this.refreshData)
  }

  componentWillUnmount () {
    Taro.eventCenter.off('addBill:success', this.refreshData)
    Taro.eventCenter.on('removeBill:success', this.refreshData)
  }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async () => {
    const { BillStore } = this.props
    const { selectTime, billDetails, activeTab } = this.state
    if (billDetails[activeTab]) return
    const params = {
      start_time: dayjs(selectTime).startOf('month').format('YYYYMMDD'),
      end_time: dayjs(selectTime).endOf('month').format('YYYYMMDD'),
      bill_type: AmountType[activeTab],
    }
    const res = await BillStore.getBillsList(params)
    if (res && res.success) {
      billDetails[activeTab] = res.data.list
      this.setState({
        billDetails,
        outTotal: (res.data && res.data.out_total) || 0,
        inTotal: (res.data && res.data.in_total) || 0
      })
    }
  }

  getBudgetDetail =  async () => {
    const { AccountStore } = this.props
    const { selectTime} = this.state
    const params = {
      time: dayjs(selectTime).format('YYYY-MM-DD HH:mm:ss'),
    }
    const res = await AccountStore.getBudgetDetail(params)
    if (res && res.success && res.data) {
      this.setState({
        budget: res.data || {}
      })
    }
  }

  refreshData = () => {
    this.setState({ activeTab: 0, billDetails: [] }, () => this.fetchData())
  }

  goToAddBill = () => {
    routerGoIn(`/pages/addBill/addBill`)
  }

  billDetailFormatChange (billDetail) {
    if (billDetail && billDetail.length) {
      billDetail = billDetail.map((e) => ({ ...e, date: dayjs(e.date_time).format('YYYYMMDD') }))
      let a = billDetail.reduce((acc, curr) => {
        if (acc[curr.date]) {
          acc[curr.date].list.push(curr)
        } else {
          acc[curr.date] = { date: curr.date, list: [curr] }
        }
        return acc
      }, {})
      const result = Object.values(a)
      result.sort((x, y) => y.date - x.date) // 按照 date 升序排序
      return result
    }
    return []
  }

  tabsChange = (index) => {
    this.setState({ activeTab: index }, () => this.fetchData())
  }

  getTabs = () => {
    const { activeTab } = this.state
    return (
      <View className='tabs'>
        {['全部', '支出', '收入', '转账'].map((item, index) => (
          <View
            className={`tabs-item ${activeTab == index ? 'active' : ''}`}
            key={index}
            onClick={() => this.tabsChange(index)}
          >
            {item}
          </View>
        ))}
      </View>
    )
  }

  onDateChange = (e) => {
    this.setState(
      {
        selectTime: dayjs(e.detail.value).format('YYYYMM')
      },
      () => this.refreshData()
    )
  }

  render () {
    const { billDetails, activeTab, outTotal, inTotal, selectTime, budget: { property } } = this.state
    const billList = this.billDetailFormatChange(billDetails[activeTab])
    const header = (
      <View>
        <Picker mode='date' fields='month' onChange={this.onDateChange}>
          {dayjs(selectTime).format('YYYY-MM')}
          <MyIcon name='unfold'></MyIcon>
        </Picker>
      </View>
    )
    return (
      <MyPage className='Home' titleContent={header} showBg>
        <View className='bills-title-bg'></View>
        <View className='bills-title'>
          <View className='bills-title-balance'>
            <View>月结余(元)</View>
            <View className='balance-num'>{property ? property-outTotal : 0}</View>
          </View>
          <View className='bills-sum'>
            <View className='bills-outcome'>
              <View>支出(元)</View>
              <View className='outcome-num'>{outTotal}</View>
            </View>
            <View className='bills-income'>
              <View>收入(元)</View>
              <View className='income-num'>{inTotal}</View>
            </View>
          </View>
        </View>
        {this.getTabs()}
        <View className='bills-list'>
          {billList &&
            !!billList.length &&
            billList.map((item, index) => (
              <View key={index}>
                <BillsDateCard billCardList={item.list} date={item.date}></BillsDateCard>
              </View>
            ))}
        </View>
        <View className='take-bill' onClick={this.goToAddBill}>
          记一笔
        </View>
      </MyPage>
    )
  }
}
