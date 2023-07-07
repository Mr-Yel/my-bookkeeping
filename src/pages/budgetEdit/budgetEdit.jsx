import dayjs from 'dayjs'
import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon } from '@/components'


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
      }
    }
  }

  componentWillMount () {
    const { UserStore: { userInfo } } = this.props
    this.setState({ ...userInfo })
  }

  componentDidMount () {
    this.fetchData()
    this.getBudgetDetail()
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
    }
  }

  refreshData = () => {
    this.setState({}, () => this.fetchData(true))
  }



  render () {
    const { outTotal, budget: { property } } = this.state
    return (
      <View className='budgetEdit'>
        <MyPage
          canGoBack
          titleContent={`${dayjs().format('YYYY年MM月')}预算管理`}
        >
          <View className='content'>
            <View>
              <Text>本月预算： {property || 0}</Text>
              <MyIcon onClick={()=>{}} name='icon-edit-1'></MyIcon>
            </View>
            <View>
              本月支出: {outTotal || 0}
            </View>
            <View>
              预算剩余： {property - outTotal || 0}
            </View>
          </View>
        </MyPage>
      </View>
    )
  }
}
