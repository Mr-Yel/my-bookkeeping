import { Component } from 'react'
import { View } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { routerGoBack } from '../../utils/router'
import { MyIcon } from '../index'

@inject('BillStore', 'UserStore')
@observer
export default class MyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  routerGoBack = () => {
    routerGoBack()
  }

  render() {
    const {
      canGoBack,
      leftContent,
      titleContent,
      rightContent,
      children,
      footer,
      className,
      UserStore: {
        setSysData: { statusBarHeight }
      }
    } = this.props
    return (
      <View className={`MyPage ${className || ''}`}>
        <View className='MyTitle' style={`paddingTop: ${statusBarHeight}px;`}>
          <View className='title'>
            {leftContent && <View className='title-left'>{leftContent}</View>}
            {canGoBack && !leftContent && (
              <View className='title-left' onClick={this.routerGoBack}>
                <MyIcon name='return'></MyIcon>
              </View>
            )}
            <View className='title-content'>{titleContent}</View>
            <View className='title-right'>{rightContent}</View>
          </View>
        </View>
        <View className='MyContent'>
          {/* <ScrollView
            style={dragStyle}
          > */}
          {children}
          {/* </ScrollView> */}
        </View>
        {footer ? <View className='MyFooter'>{footer}</View> : null}
      </View>
    )
  }
}
