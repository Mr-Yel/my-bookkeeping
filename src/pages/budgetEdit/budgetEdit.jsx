import dayjs from 'dayjs'
import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon, MyModal } from '@/components'


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
      openBudgetEdit: false
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

  onChange = (e, type) => {
    const { budget } = this.state
    switch (type) {
      case 'property':
        const val = e && e.detail && e.detail.value
        this.setState({ budget: { ...budget, property: val } })
        break;
    }
  }

  render () {
    const { outTotal, budget: { property }, openBudgetEdit } = this.state
    return (
      <View className='budgetEdit'>
        <MyPage
          canGoBack
          titleContent={`${dayjs().format('YYYY年MM月')}预算管理`}
        >
          <View className='content'>
            <View className='header_card'>
              <View className='echarts'></View>
              <View className='show'>
                <View>
                  <Text>本月预算</Text>
                  <Text onClick={() => this.setState({ openBudgetEdit: true })}>￥{property || 0}<MyIcon name='icon-edit-1'></MyIcon></Text>
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
              focus
              value={property}
              className='mark-edit-name-input'
              type='number'
              placeholder='请输入预算'
              maxLength='10'
              onInput={e => { this.onChange(e, 'property') }}
            />}
            onClose={() => this.setState({ openBudgetEdit: false })}
            onCancel={() => this.setState({ openBudgetEdit: false })}
            onConfirm={(e) => this.setUserInfo(e, 'name')}
            showFooter
          ></MyModal>
        </MyPage>
      </View>
    )
  }
}
