import dayjs from 'dayjs'
import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon, MyModal } from '@/components'
import WaterPoloPieChart  from '@/components/Charts/WaterPoloPieChart'

@inject('BillStore', 'AccountStore', 'UserStore')
@observer
export default class budgetEdit extends Component {

  constructor(props) {
    super(props);

    this.curTime = dayjs()

    this.state = {
      billDetails: new Array(4).fill(undefined),
      selectTime: this.curTime.format('YYYYMM'),
      outTotal: 0,
      budget: {
        property: 0
      },
      cloneProperty: 0,
      openBudgetEdit: false
    }
  }

  componentWillMount () {
    const { UserStore: { userInfo } } = this.props
    this.setState({ ...userInfo })
  }

  componentDidMount () {
    Promise.all([this.fetchData(),  this.getBudgetDetail()]).then(res=>{
      let outTotal = 0
      let property = 0
      if(res && res[0]) {
        outTotal = res[0]?.data?.out_total || 0
      }
      if(res && res[1]) {
        property = res[1]?.data?.property || 0
      }
      this.WaterPoloPieChart.refresh(property, outTotal);
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async () => {
    const { BillStore } = this.props
    const { selectTime, billDetails, activeTab } = this.state
    if (billDetails[activeTab]) return
    const params = {
      start_time: dayjs(selectTime).startOf('month').format('YYYYMMDD'),
      end_time: dayjs(selectTime).endOf('month').format('YYYYMMDD'),
    }
    const res = await BillStore.getBillsList(params)
    if (res && res.success) {
      billDetails[activeTab] = res.data.list
      this.setState({
        billDetails,
        outTotal: (res.data && res.data.out_total) || 0
      })
      return res
    }
  }

  getBudgetDetail = async () => {
    const { AccountStore } = this.props
    const { selectTime } = this.state
    const params = {
      time: dayjs(selectTime).format('YYYY-MM-DD HH:mm:ss'),
    }
    const res = await AccountStore.getBudgetDetail(params)
    if (res && res.success && res.data) {
      this.setState({
        budget: res.data || {}
      })
      return res
    }
  }

  refreshData = () => {
    this.setState({}, () => this.fetchData(true))
  }

  onChange = (e, type) => {
    const { budget } = this.state
    const val = e && e.detail && e.detail.value
    switch (type) {
      case 'property':
        this.setState({ budget: { ...budget, property: e } })
        break;
      default: 
        this.setState({ [type]: val })
    }
  }

  setBudgetProperty = async () => {
    const { AccountStore } = this.props
    const { budget, cloneProperty, outTotal } = this.state
    const params = {
      property: cloneProperty,
      budget_id: budget._id,
    }
    const res = await AccountStore.setBudgetProperty(params)
    if (res && res.success && res.data) {
      this.onChange(cloneProperty, 'property')
      this.setState({openBudgetEdit: false})
      this.WaterPoloPieChart.refresh(cloneProperty, outTotal);
      Taro.eventCenter.trigger('propertyChange:success')
      Taro.showToast({
        title: '修改成功',
        icon: 'success',
      })
    }
  }

  render () {
    const { outTotal, budget: { property }, openBudgetEdit, cloneProperty } = this.state
    return (
      <View className='budgetEdit'>
        <MyPage
          canGoBack
          titleContent={`${dayjs().format('YYYY年MM月')}预算管理`}
        >
          <View className='content'>
            <View className='header_card'>
              <View className='pie-chart'>
                <WaterPoloPieChart ref={e=>this.WaterPoloPieChart=e} />
              </View>
              <View className='show'>
                <View>
                  <Text>本月预算</Text>
                  <Text onClick={() => this.setState({ openBudgetEdit: true, cloneProperty: property })}>￥{property || 0}<MyIcon name='icon-edit-1'></MyIcon></Text>
                </View>
                <View>
                  <Text>本月支出</Text>
                  <Text>￥{outTotal || 0}</Text>
                </View>
                <View>
                  <Text>预算剩余</Text>
                  <Text>￥{property - outTotal || 0}</Text>
                </View>
              </View>
            </View>
          </View>
          <MyModal
            open={openBudgetEdit}
            title='设置预算'
            content={<Input
              value={cloneProperty}
              className='mark-edit-name-input'
              type='number'
              placeholder='请输入预算'
              maxLength='10'
              onInput={e => { this.onChange(e, 'cloneProperty') }}
            />}
            onClose={() => this.setState({ openBudgetEdit: false })}
            onCancel={() => this.setState({ openBudgetEdit: false })}
            onConfirm={(e) => this.setBudgetProperty()}
            showFooter
          ></MyModal>
        </MyPage>
      </View>
    )
  }
}
