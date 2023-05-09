import { Component } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoBack } from '../../utils/router'
import { MyIcon } from '../index'

@inject('BillStore', 'UserStore')
@observer
export default class MyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dragStyle: { //下拉框的样式
        top: '30px',
        transition: `all 1s`
      },
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  routerGoBack = () => {
    routerGoBack()
  }

  render () {
    const { dragStyle } = this.state;
    const { leftContent, titleContent, rightContent, children, className,
      UserStore: { setSysData: { statusBarHeight } } } = this.props
    return (
      <View className={`MyPage ${className || ''}`}>
        <View className='MyTitle' style={`paddingTop: ${statusBarHeight}px;`}>
          <View className='title-left' onClick={this.routerGoBack}>
            {leftContent}
            {!leftContent && <MyIcon name='return'></MyIcon>}
          </View>
          <View className='title-content'>
            {titleContent}
          </View>
          <View className='title-right'>
            {rightContent}
          </View>
        </View>
        <View className='MyContent'>
          {/* <ScrollView
            style={dragStyle}
          > */}
            {children}
          {/* </ScrollView> */}
        </View>
      </View>
    )
  }
}
