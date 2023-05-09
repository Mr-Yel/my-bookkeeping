import { Component } from 'react'
import { Text } from '@tarojs/components'

export default class MyIcon extends Component {

  nameMap = {

  }

  nameTransform = (name) => {
    if(this.nameMap[name]) return this.nameMap[name]
    return name
  }

  render () {
    const { prefix='icon-', name } = this.props
    const iconName = this.nameTransform(name)
    return (
      <Text className={`MyIcon iconfont ${prefix}${iconName}`}></Text>
    )
  }
}
