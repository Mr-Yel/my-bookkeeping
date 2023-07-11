import { Component } from 'react'
import { Text } from '@tarojs/components'

export default class MyIcon extends Component {

  nameMap = {

  }

  nameTransform = (name) => {
    if(this.nameMap[name]) return this.nameMap[name]
    return name
  }

  click = () => {
    const { onClick } = this.props
    onClick && onClick()
  }

  render () {
    const { prefix='icon-', name } = this.props
    const iconName = this.nameTransform(name)
    return (
      <Text onClick={this.click} className={`MyIcon iconfont ${prefix}${iconName} ${iconName}`}></Text>
    )
  }
}
