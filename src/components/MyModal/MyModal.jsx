import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { routerGoBack } from '../../utils/router'
import { MyIcon } from '../index'

export default class MyModal extends Component {

  state = {
    show: false,
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUpdate(prevProps) {
    if ('open' in prevProps) {
      // 在这里处理父组件的props变化
      this.show = prevProps.open
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  show = false
  
  close = () => {
    const { onClose  } = this.props
    onClose && onClose()
  }
  
  cancel = () => {
    const { onCancel  } = this.props
    onCancel && onCancel()
  }

  confirm = () => {
    const { onConfirm  } = this.props
    onConfirm && onConfirm()
  }

  render () {
    const { showTitle = true, title, closeButton = true, closeOnClickOverlay = true,
      content, showFooter, footer, cancelText, confirmText } = this.props
    return (
      <View className={`MyModal ${this.show ? 'active' : ''}`}>
        <View className='MyModal_bg' onClick={()=>closeOnClickOverlay && this.close()}></View>
        <View className='MyModal_container'>
          {showTitle && <View className='MyModal_header'>
            {title}
            {closeButton && <MyIcon onClick={()=>this.close()} name='close'></MyIcon>}
          </View>}
          <View className='MyModal_content'>
            {content}
          </View>
          {showFooter && <View className='MyModal_footer'>
            {footer}
            {!footer && <View  className='MyModal_action'>
              <Text onClick={this.cancel}>{cancelText || '取消'}</Text>
              <Text onClick={this.confirm}>{confirmText || '确认'}</Text>
            </View>}
          </View>}
        </View>
      </View>
    )
  }
}
