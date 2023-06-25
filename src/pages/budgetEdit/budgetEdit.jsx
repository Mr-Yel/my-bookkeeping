import Taro from "@tarojs/taro";
import { Component } from 'react'
import { View } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage } from '../../components'


@inject('BillStore', 'UserStore')
@observer
export default class budgetEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentWillMount () {
    const { UserStore: { userInfo } } = this.props
    this.setState({ ...userInfo })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const {  } = this.state
    return (
      <View className='budgetEdit'>
        <MyPage
          canGoBack
          titleContent='预算管理'
        >
          <View className='content'>
            <View>
              本月预算： 
            </View>
            <View>
              本月支出 
            </View>
            <View>
              预算剩余： 
            </View>
          </View>
        </MyPage>
      </View>
    )
  }
}
