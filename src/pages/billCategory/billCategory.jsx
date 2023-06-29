import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, MovableArea, MovableView } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyPage, MyIcon } from '@/components'
import { routerGoIn, routerGoBack } from '@/utils/router'

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
      activeType: 'out',
      list: [[], []],
      // 是否编辑
      editStatus: false,
      // 选中的分类编辑列表
      selectEditList: [],
      // 拖动相关参数
      dragFlag: false,
      longpressFlag: false,
      movableViewInfo: {
        y: 0,
        showClass: 'none',
        // data: {}
        bill_type_icon: '',
        bill_type_name: ''
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

  componentWillUnmount() {}

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
  // 列表项拖动相关函数
  dragStart = (event) => {
    const { list, activeTab, pageInfo, movableViewInfo } = this.state
    let startIndex = event.currentTarget.dataset.index
    // console.log('获取到的元素为', list[activeTab][startIndex])
    // 初始化页面数据
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
    // movableViewInfo.data = list[activeTab][startIndex]
    movableViewInfo.bill_type_icon = list[activeTab][startIndex].bill_type_icon
    movableViewInfo.bill_type_name = list[activeTab][startIndex].bill_type_name
    movableViewInfo.showClass = 'inline'
    movableViewInfo.y = pageInfo.startY - pageInfo.rowHeight / 2
    // console.log(movableViewInfo, pageInfo)

    this.setState({
      dragFlag: true,
      longpressFlag: true,
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  }

  dragMove = (event) => {
    const { list, activeTab, movableViewInfo, pageInfo, longpressFlag } = this.state
    if (!longpressFlag) return
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

  dragEnd = () => {
    let { pageInfo, movableViewInfo, longpressFlag } = this.state
    if (!longpressFlag) return
    // 重置页面数据
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    movableViewInfo.showClass = 'none'
    // 将长按标记设为否
    longpressFlag = false

    this.setState({
      longpressFlag,
      pageInfo,
      movableViewInfo
    })
  }
  /**
   * 保存排序
   */
  saveList = () => {
    console.log('保存')
    // 调用接口
    Taro.showModal({
      title: '提示',
      content: '确认保存此列表排序吗？',
      success: (res) => {
        if (res.confirm) {
          this.setState({
            dragFlag: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  /**
   * 刷新列表
   * @param {*} refreshType 为1时刷新列表至初始状态，为2刷新当前列表
   */
  refreshData = (refreshType = 1) => {
    const { activeType } = this.state
    if (refreshType === 1) this.setState({ activeTab: 0 }, () => this.fetchData())
    else {
      Taro.showModal({
        title: '提示',
        content: '确认重置此列表排序吗？',
        success: (res) => {
          if (res.confirm) {
            this.setState(() => this.fetchData(activeType))
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
  /**
   * 点击tab栏项
   * @param {*} type
   * @returns
   */
  changeBillType = (type) => {
    // console.log(type)
    const { activeTab, list } = this.state
    this.setState({
      activeType: type,
      editStatus: false
    })
    if (enumBillType[type] == activeTab) return
    if (list[enumBillType[type]] && list[enumBillType[type]].length) {
      this.setState({ activeTab: enumBillType[type], editStatus: false })
      return
    }
    this.fetchData(type)
  }
  /**
   * 点击添加按钮
   */
  addBillCategory = () => {
    const { activeTab } = this.state
    routerGoIn(`/pages/addBillCategory/addBillCategory?type=${activeTab}&editType=0`)
  }
  /**
   * 跳转分类编辑页面
   * @param {*} id 跳转编辑页面所需id
   */
  goEditOrSelect = (id) => {
    const { selectEditList, editStatus } = this.state
    if (!editStatus) {
      routerGoIn(`/pages/addBillCategory/addBillCategory?id=${id}`)
    } else {
      let index = selectEditList.findIndex((item) => item === id)
      if (index !== -1) selectEditList.splice(index, 1)
      else selectEditList.push(id)
      this.setState({
        selectEditList: selectEditList
      })
    }
  }
  /**
   * 点击列表表头编辑按钮
   */
  editCategory = () => {
    const { editStatus, selectEditList } = this.state
    this.setState({
      editStatus: !editStatus,
      selectEditList: editStatus ? [] : selectEditList
    })
  }
  /**
   * 选中列表项进行操作
   */
  handleSelectItem = async () => {
    const { selectEditList } = this.state
    Taro.showModal({
      title: '提示',
      content: '确认删除选中的分类吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用删除接口
          console.log('删除')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  render() {
    const { list, editStatus, activeTab, dragFlag, movableViewInfo, pageInfo, selectEditList } = this.state
    const renderItem = (item, index) => {
      return (
        <View
          key={item._id}
          className={`billCategory-list-item ${pageInfo.readyPlaceIndex === index ? 'ready-place' : null}`}
          data-index={index}
          // onTouchStart={this.dragStart}
          onLongPress={this.dragStart}
          onTouchMove={this.dragMove}
          onTouchEnd={this.dragEnd}
          onClick={() => this.goEditOrSelect(item._id)}
          style={{
            height: `${pageInfo.rowHeight}px`
            //   boxSizing: 'border-box',
            //   transform: `translateY(${this.state.translateY[index]}px);`
          }}
        >
          <View className='billCategory-list-item-left'>
            <View className='billCategory-list-icon'>
              <View style={{ paddingLeft: '24rpx', paddingTop: '12rpx' }}>
                <MyIcon name={item.bill_type_icon}></MyIcon>
              </View>
            </View>
            <View className='billCategory-list-name'>{item.bill_type_name}</View>
          </View>
          <View
            className={`billCategory-list-item-right ${
              selectEditList && selectEditList.length && selectEditList.includes(item._id)
                ? 'billCategory-list-item-right-active'
                : ''
            }`}
            style={{ display: `${editStatus ? 'block' : 'none'}` }}
          ></View>
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
    const footer =
      selectEditList && selectEditList.length ? (
        <View className='billCategory-footer'>
          <View className='billCategory-footer-text'>{`已选择${selectEditList.length}个分类`}</View>
          <View className='billCategory-footer-btn' onClick={this.handleSelectItem}>
            删除
          </View>
        </View>
      ) : null
    return (
      <MyPage canGoBack className='billCategory' titleContent={header} footer={footer}>
        <View className='billCategory-list'>
          <View className='billCategory-list-header'>
            <View className='billCategory-list-left'>
              <Text className='billCategory-list-left-title'>生活账本</Text>
              <Text className='billCategory-list-left-tips'>长按拖动排序</Text>
            </View>
            <View className='billCategory-list-right'>
              <Text
                className='billCategory-list-right-button'
                style={{ marginRight: `${dragFlag ? '16rpx' : '0'}` }}
                onClick={this.editCategory}
              >
                {editStatus ? '取消' : '编辑'}
              </Text>
              <Text
                className='billCategory-list-right-button'
                style={{ display: `${dragFlag ? 'inline' : 'none'}`, marginRight: `${dragFlag ? '16rpx' : '0'}` }}
                onClick={this.saveList}
              >
                保存排序
              </Text>
              <Text
                className='billCategory-list-right-button'
                style={{ display: `${dragFlag ? 'inline' : 'none'}` }}
                onClick={() => this.refreshData(2)}
              >
                重置排序
              </Text>
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
              y={movableViewInfo.y - 96}
              outOfBounds
              direction='vertical'
              className='billCategory-list-item-move'
              style={{ height: `${pageInfo.rowHeight}px` }}
            >
              <View className='billCategory-list-icon'>
                <View style={{ paddingLeft: '24rpx', paddingTop: '12rpx' }}>
                  <MyIcon name={movableViewInfo.bill_type_icon}></MyIcon>
                </View>
              </View>
              <Text className='billCategory-list-name'>{movableViewInfo.bill_type_name}</Text>
            </MovableView>
          </MovableArea>
        </View>
        {!editStatus ? (
          <View className='billCategory-add' onClick={this.addBillCategory}>
            <View style={{ paddingLeft: '18rpx' }}>
              <MyIcon name='add-3'></MyIcon>
            </View>
          </View>
        ) : null}
      </MyPage>
    )
  }
}
