

import { Component } from 'react'
import { View, PageContainer } from '@tarojs/components'
import { observer, inject } from 'mobx-react'

@inject('BillStore', 'UserStore')
@observer
export default class MyPopUp extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClose () {
    this.props.onClose()
  }

  render () {
    const { isOpened, title, showCloseBtn, position, round=true } = this.props
    return (
      <PageContainer 
        className='MyPopUp' 
        show={isOpened} 
        position={position} 
        round={round} 
        onClickoverlay={()=>this.handleClose()}
      >
        <View className='MyPopUp_container'>
          {title && <View className='layout-header'>
            {title}
            {showCloseBtn && <View className='close-img' >X</View>}
          </View>}
          <View className='layout-body'>
            {this.props.children}
          </View>
        </View>
      </PageContainer>
    )
  }
}
