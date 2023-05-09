import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoBack } from '../../utils/router'
import { MyIcon } from '../index'

@inject('BillStore', 'UserStore')
@observer
export default class MyNavbar extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  routerGoBack = () => {
    routerGoBack()
  }

  render () {
    const { leftContent, titleContent, rightContent, showBg, children,
      UserStore: { setSysData: { statusBarHeight } } } = this.props
    const height = 80
    return (
      <View className='MyNavbar' style={`height: ${height+statusBarHeight}rpx;`}>
        
        {children}
      </View>
    )
  }
}
