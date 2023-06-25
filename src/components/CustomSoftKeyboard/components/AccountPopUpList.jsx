import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPopUp } from '@/components'
// import { getNumber, checkString } from '@/utils'
// import { routerGoBack } from '@/utils/router'

@inject('AccountStore', 'UserStore')
@observer
export default class AccountPopUpList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],       // 所有账户
    };
  }

  componentWillMount () { }

  componentDidMount () { 
    this.fetchData()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  fetchData = async () => {
    const { AccountStore: { accounts }, onChange } = this.props
    this.setState({accounts: accounts})
    onChange && onChange(accounts && accounts[0] || {})
  }

  handelClick = (item) => {
    const { onChange, onClose } = this.props
    onChange && onChange(item)
    onClose && onClose()
  }

  render () {
    const { accounts } = this.state
    const { isOpened } = this.props
    return (
      <View className='AccountPopUpList'>
        <MyPopUp
          isOpened={isOpened}
          title='我的账本'
          onClose={this.props.onClose}
        >
          {accounts && !!accounts.length && accounts.map((item,index)=><View
            key={index}
            onClick={()=>this.handelClick(item)}
            className='account-item'
          >
            <Image src={item.account_img}></Image>
            {item.name}
          </View>)}
          {!accounts || accounts.length ==0 && <View>不存在账本数据</View>}
        </MyPopUp>
      </View>
    )
  }
}
