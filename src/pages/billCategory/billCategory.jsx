import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, MovableArea, MovableView } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon } from '@/components'
import { routerGoBack } from '@/utils/router'

const enumBillType = {
  out: 0,
  in: 1,
  0: 'out',
  1: 'in'
}

@inject('BillStore', 'UserStore')
@observer
export default class billCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
      list: [[], []],
      // 拖动相关参数
      movableViewInfo: {
        y: 0,
        showClass: 'none',
        data: {}
      },
      pageInfo: {
        rowHeight: 64,
        scrollHeight: 100,
        startIndex: null,
        scrollY: true,
        readyPlaceIndex: null,
        startY: 0,
        selectedIndex: null
      }
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.fetchData()
    // this.calcScrollHeight()
    // this.initTranslateY()
  }

  componentWillUnmount() {
    
  }

  componentDidShow() {}

  componentDidHide() {}

  fetchData = async (type = 'out') => {
    const { BillStore } = this.props
    const { list } = this.state
    const params = {
      bill_type: type
    }
    const res = await BillStore.getBillTypes(params)
    if (res && res.success) {
      if (res.data && res.data.length == 0) {
        await Taro.showModal({
          title: '账单类别为空，请先添加账单类别',
          showCancel: false,
          confirmColor: '#000',
          confirmText: '我知道了',
          success: () => {
            routerGoBack()
          }
        })
        return
      }
      list[enumBillType[type]] = res.data
      this.setState({
        activeTab: enumBillType[type],
        list
      })
    }
  }

  dragStart = (event) => {
    const { list, activeTab, pageInfo, movableViewInfo } = this.state
    let startIndex = event.target.dataset.index
    console.log('获取到的元素为', list[activeTab][startIndex])
    // 初始化页面数据
    console.log(event)
    pageInfo.startY = event.touches[0].clientY
    pageInfo.readyPlaceIndex = startIndex
    pageInfo.selectedIndex = startIndex
    pageInfo.scrollY = false
    pageInfo.startIndex = startIndex
    // let y = { y: pageInfo.startY - pageInfo.rowHeight / 2 }
    // console.log(y)
    // this.setState({
    //   movableViewInfo: Object.assign(movableViewInfo, y)
    // })
    // 初始化拖动控件数据
    movableViewInfo.data = list[activeTab][startIndex]
    movableViewInfo.showClass = 'inline'
    movableViewInfo.y = pageInfo.startY - pageInfo.rowHeight / 2

    this.setState({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  }

  dragMove = (event) => {
    const { list, activeTab, movableViewInfo, pageInfo } = this.state
    // 计算拖拽距离
    let movedDistance = event.touches[0].clientY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - pageInfo.rowHeight / 2 + movedDistance
    // console.log('移动元素的y为', movableViewInfo.y)

    // 修改预计放置位置
    let movedIndex = parseInt(movedDistance / pageInfo.rowHeight)
    let readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    } else if (readyPlaceIndex >= list[activeTab].length) {
      readyPlaceIndex = list[activeTab].length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = list[activeTab][pageInfo.selectedIndex]

      list[activeTab].splice(pageInfo.selectedIndex, 1)
      list[activeTab].splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', list[readyPlaceIndex])

    this.setState({
      movableViewInfo,
      list,
      pageInfo
    })
  }

  dragEnd = (event) => {
    const { pageInfo, movableViewInfo } = this.state
    // 重置页面数据
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    movableViewInfo.showClass = 'none'

    this.setState({
      pageInfo,
      movableViewInfo
    })
  }

  refreshData = () => {
    this.setState({ activeTab: 0 }, () => this.fetchData())
  }

  changeBillType = (type) => {
    // console.log(type)
    const { activeTab, list } = this.state
    if (enumBillType[type] == activeTab) return
    if (list[enumBillType[type]] && list[enumBillType[type]].length) {
      this.setState({ activeTab: enumBillType[type] })
      return
    }
    this.fetchData(type)
  }

  render() {
    const { list, activeTab, movableViewInfo, pageInfo } = this.state
    const renderItem = (item, index) => {
      return (
        <View
          key={item._id}
          className={`billCategory-list-item ${pageInfo.readyPlaceIndex === index ? 'ready-place' : null}`}
          data-index={index}
          onLongPress={this.dragStart}
          onTouchMove={this.dragMove}
          onTouchEnd={this.dragEnd}
          style={{
            height: `${pageInfo.rowHeight}px`
            //   boxSizing: 'border-box',
            //   transform: `translateY(${this.state.translateY[index]}px);`
          }}
        >
          <View className='billCategory-list-icon'>
            <View style={{ paddingLeft: '24rpx', paddingTop: '12rpx' }}>
              <MyIcon name={item.bill_type_icon}></MyIcon>
            </View>
          </View>
          <Text className='billCategory-list-name'>{item.bill_type_name}</Text>
        </View>
      )
    }
    const header = (
      <View className='tabs'>
        {[
          { label: '支出', type: 'out' },
          { label: '收入', type: 'in' }
        ].map((item, index) => (
          <View
            key={index}
            className={`tabs-item ${activeTab == index ? 'active' : ''}`}
            onClick={() => this.changeBillType(item.type)}
          >
            {item.label}
          </View>
        ))}
      </View>
    )
    return (
      <MyPage canGoBack className='billCategory' titleContent={header}>
        <View className='billCategory-list'>
          <View className='billCategory-list-header'>
            <View className='billCategory-list-left'>
              <Text className='billCategory-list-left-title'>生活账本</Text>
              <Text className='billCategory-list-left-tips'>长按拖动排序</Text>
            </View>
            <View className='billCategory-list-right'>
              <Text className='billCategory-list-right-button'>编辑</Text>
            </View>
          </View>
          <scroll-view scroll-y={pageInfo.scrollY} style={{ height: `${pageInfo.scrollHeight}%` }}>
            {list && list[activeTab] && list[activeTab].map((item, index) => renderItem(item, index))}
          </scroll-view>
          <MovableArea
            className='billCategory-list-movableArea'
            style={{ display: `${movableViewInfo.showClass}`, height: `${pageInfo.scrollHeight}%` }}
          >
            <MovableView
              y={movableViewInfo.y}
              outOfBounds
              direction='vertical'
              className='billCategory-list-item-move'
              style={{ height: `${pageInfo.rowHeight}px` }}
            >
              <View className='billCategory-list-icon'>
                <View style={{ paddingLeft: '24rpx', paddingTop: '12rpx' }}>
                  <MyIcon name={movableViewInfo.data.bill_type_icon}></MyIcon>
                </View>
              </View>
              <Text className='billCategory-list-name'>{movableViewInfo.data.bill_type_name}</Text>
            </MovableView>
          </MovableArea>
        </View>
        <View className='billCategory-add'>
          <View style={{ paddingLeft: '20rpx' }}>
            <MyIcon name='add-3'></MyIcon>
          </View>
        </View>
      </MyPage>
    )
  }
}
