import dayjs from 'dayjs'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon } from '../../components'
import { routerGoBack } from '../../utils/router'
// 新增时显示title类型
const titleType = {
  0: '支出',
  1: '收入'
}

@inject('BillStore', 'UserStore', 'AccountStore')
@observer
export default class addBill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      selectIndex: 0,
      selectColorIndex: 0,
      category: {
        icon: '',
        name: '',
        color: ''
      },
      colorList: ['#0f9c5a', '#fcb585', '#f99f6a', '#d6a268', '#23a4f1', '#ff7077', '#fd87b9'],
      iconList: [
        { icon: 'restaurant', name: '餐饮' },
        { icon: 'renting_house-1', name: '租房' },
        { icon: 'hydropower-1', name: '水电' },
        { icon: 'shopping-1', name: '购物' },
        { icon: 'fruit-1', name: '水果' },
        { icon: 'red_envelope-1', name: '红包' },
        { icon: 'pet-1', name: '宠物' },
        { icon: 'entertainment-1', name: '娱乐' },
        { icon: 'wages', name: '工资' }
      ]
    }
  }

  componentWillMount() {
    const { router } = getCurrentInstance()
    const { selectIndex, iconList, colorList, selectColorIndex } = this.state
    this.type = router?.params?.type
    this.id = router?.params?.id
    this.setState({
      category: Object.assign(iconList[selectIndex], { color: colorList[selectColorIndex] })
    })
  }

  componentDidMount() {
    if (this.type && !this.id) {
      this.setTitle()
    } else {
      this.setTitle(1)
      this.fetchData()
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  fetchData = async () => {}
  /**
   * 设置标题
   * @param {*} editType 0为添加分类，1为编辑分类
   */
  setTitle = (editType = 0) => {
    this.setState({
      title: editType === 0 ? titleType[this.type] : '编辑分类'
    })
  }
  /**
   * 选择图标颜色
   * @param {*} index 颜色下标
   */
  selectColor = (index) => {
    const { category, colorList } = this.state
    this.setState({
      selectColorIndex: index,
      category: Object.assign(category, { color: colorList[index] })
    })
  }
  /**
   * 选择图标
   * @param {*} index 图标下标
   */
  selectIcon = (index) => {
    const { iconList, colorList, selectColorIndex } = this.state
    this.setState({
      selectIndex: index,
      category: Object.assign(iconList[index], { color: colorList[selectColorIndex] })
    })
  }
  /**
   * 提交新增、编辑结果保存
   */
  submitBillCategory = async () => {
    console.log('提交')
  }

  render() {
    const { title, colorList, category, iconList, selectIndex } = this.state
    const header = (
      <View className='header'>
        <View className='header-title'>{title}</View>
      </View>
    )
    const colorListView =
      colorList &&
      colorList.length &&
      colorList.map((item, index) => (
        <View
          className='name-edit-color-item'
          style={{ backgroundColor: `${item}` }}
          onClick={() => this.selectColor(index)}
        ></View>
      ))
    return (
      <View className='addBillCategory'>
        <MyPage canGoBack titleContent={header} showBg>
          <View className='bills-title-bg'></View>
          <View className='content'>
            <View className='name-edit block'>
              <View className='first-line'>
                <View className='name-edit-icon' style={{ backgroundColor: `${category.color}` }}>
                  <View style={{ paddingLeft: '18rpx', paddingTop: '8rpx' }}>
                    <MyIcon name={category.icon}></MyIcon>
                  </View>
                </View>
                <Input value={category.name} type='text' maxLength='10' className='name-edit-name' />
              </View>
              <View className='name-edit-color'>{colorListView}</View>
            </View>
            <View className='icon-edit block'>
              <View className='icon-edit-title'>选择分类图标</View>
              <View className='icon-edit-list'>
                {iconList &&
                  iconList.length &&
                  iconList.map((item, index) => (
                    <View className='icon-edit-list-item' key={index} onClick={() => this.selectIcon(index)}>
                      <View className='icon-edit-list-icon'>
                        <MyIcon name={item.icon}></MyIcon>
                      </View>
                      {selectIndex === index ? (
                        <Text className='icon-edit-select'></Text>
                      ) : (
                        <Text className='icon-edit-no-select'></Text>
                      )}
                      <Text className='icon-edit-list-name'>{item.name}</Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
          <View className='addBillCategory-submit' onClick={this.submitBillCategory}>
            <Text className='addBillCategory-submit-icon'></Text>
          </View>
        </MyPage>
      </View>
    )
  }
}
