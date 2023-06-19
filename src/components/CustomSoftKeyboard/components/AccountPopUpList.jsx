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
      accountBooks: [],       // 所有账本
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
    const { AccountStore, onChange } = this.props
    const res = await AccountStore.getAccountList()
    console.log(res);
    if(res && res.data) {
      this.setState({accountBooks: res.data})
      if(res.data.length) {
        onChange && onChange(res.data[0])
      }
    }
  }

  handelClick = (item) => {
    const { onChange, onClose } = this.props
    onChange && onChange(item)
    onClose && onClose()
  }

  render () {
    const { accountBooks } = this.state
    const { isOpened } = this.props
    return (
      <View className='AccountPopUpList'>
        <MyPopUp
          isOpened={isOpened}
          title='我的账本'
          onClose={this.props.onClose}
        >
          {accountBooks && !!accountBooks.length && accountBooks.map((item,index)=><View
            key={index}
            onClick={()=>this.handelClick(item)}
            className='account-item'
          >
            <Image src={item.account_img}></Image>
            {item.name}
          </View>)}
          {!accountBooks || accountBooks.length ==0 && <View>不存在账本数据</View>}
        </MyPopUp>
      </View>
    )
  }
}
