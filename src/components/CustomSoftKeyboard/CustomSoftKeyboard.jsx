import dayjs from 'dayjs'
import { Component } from 'react'
import { View, Input, Text, ScrollView, Picker } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyIcon } from '@/components'
import { getNumber, checkString } from '@/utils'
import { routerGoBack } from '@/utils/router'
import getKeyboardBtnCrt from './keyboardBtnCrt'
import AccountPopUpList from './components/AccountPopUpList'

@inject('BillStore', 'UserStore')
@observer
export default class CustomSoftKeyboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      operationString: '',                  // 金额操作符
      curOperator: '',                      // 当前操作符
      amount: 0,                            // 金额
      notes: '',                            // 备注
      accountBook: {},                      // 当前账本
      date: dayjs().format('YYYY/MM/DD'),   // 日期
      time: dayjs().format('HH:mm'),        // 时间

      isAccountBookOpened: false,
    }
  }

  componentWillMount() {
    this.keyboardBtnCrt = getKeyboardBtnCrt()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  
  get selectButtons() {
    const { accountBook, date, time } = this.state
    return [
      {
        name: accountBook && accountBook.name || '请选择账本',
        onClick: () => this.setState({isAccountBookOpened: true})
      },
      {
        name: <Picker value={time} mode='time' onChange={(e)=>this.onChange('time', e)}>
          {time ? time : '请选择时间'}
        </Picker>,
      },
      {
        name: <Picker value={date} mode='date' onChange={(e)=>this.onChange('date', e)}>
          {date ? dayjs(date).format('YYYY/MM/DD') : '请选择日期'}
        </Picker>,
      },
      // {
      //   name: '图片',
      // },
      // {
      //   name: '模板',
      // },
    ]
  }

  routerGoBack = () => {
    routerGoBack()
  }

  isComplete = () => {
    const { amount, notes, accountBook, date, time } = this.state
    const { isComplete } = this.props
    isComplete &&
      isComplete({
        amount,
        notes,
        accountBook,
        date,
        time
      })
  }

  updating = (string) => {
    let number = getNumber(string)
    let lastChar = string.charAt(string.length - 1) // 获取最后一个字符
    this.setState({
      amount: number,
      operationString: string,
      curOperator: lastChar == '+' || lastChar == '-' ? lastChar : ''
    })
  }

  keyboardClick = (item) => {
    const { operationString, curOperator } = this.state
    let string = operationString
    if (item.type == 'complete') {
      // 完成
      this.isComplete()
    } else if (item.type == 'retreat') {
      // 撤回
      string = string.slice(0, -1)
      this.updating(string)
    } else if (item.type == 'operator' && curOperator) {
      // 操作符并且再次点击操作符
      string = string.slice(0, -1)
      string = string + item.value
      this.updating(string)
    } else if (item.type == 'punctuation' && (curOperator || string.length == 0)) {
      // 小数点并且最后一位为操作符或者长度0
      return
    } else {
      string = string + item.value
      this.updating(string)
    }
  }

  onChange = (type, e) => {
    switch (type) {
      case 'notes':
        let value = e && e.detail && e.detail.value
        this.setState({ [type]: value })
        break;
      case 'time':
      case 'date':
        value = e && e.detail && e.detail && e.detail.value
        this.setState({[type]: value})
        break;
      default:
        this.setState({ [type]: e })
        break
    }
  }

  updateValue = (data) => {
    console.log('data',data);
    this.setState({ 
      notes: data.notes, 
      amount: data.amount,
      date: data.date_time ? dayjs(data.date_time).format('YYYY/MM/DD') : dayjs().format('YYYY/MM/DD'),
      time: data.date_time ? dayjs(data.date_time).format('HH:mm') : dayjs().format('HH:mm'),
    })
  }

  render() {
    const { amount, operationString, notes, isAccountBookOpened } = this.state
    const { keyboardBtnCrt } = this

    return (
      <View className='CustomSoftKeyboard'>
        <View className='keyboard-header'>
          <Input
            type='text'
            value={notes}
            onInput={(e) => this.onChange('notes', e)}
            class='keyboard-note'
            placeholder='备注'
          />
          <View class='keyboard-amount'>
            <Text class='keyboard-amount-res'>￥{amount}</Text>
            {checkString(operationString, ['+', '-', '.']) && (
              <Text class='keyboard-amount-operation'>{operationString}</Text>
            )}
          </View>
        </View>
        <View className='SelectButtonBox'>
          {this.selectButtons && !!this.selectButtons.length && <View className='select-box'>
            <ScrollView className='scroll-view_H' scroll-x='true' style='width: 100%'>
              {
                this.selectButtons.map((item,index)=><View 
                  className='scroll-view-item_H' 
                  key={index}
                  onClick={item.onClick}
                >
                  {item.name}
                </View>)
              }
            </ScrollView>
          </View>}
        </View>
        <View className='keyboard-content'>
          {keyboardBtnCrt &&
            keyboardBtnCrt.length &&
            keyboardBtnCrt.map((item, index) => (
              <View
                key={index}
                className='keyboard-content-item'
                style={`width: ${item.width ? item.width * 25 : 25}%;`}
              >
                <View className='keyboard-content-button' onClick={() => this.keyboardClick(item)}>
                  {item.type == 'retreat' && <MyIcon name={item.icon}></MyIcon>}
                  {item.type != 'retreat' && <Text>{item.value}</Text>}
                </View>
              </View>
            ))}
        </View>


        <AccountPopUpList 
          isOpened={isAccountBookOpened}
          onChange={(e)=>this.onChange('accountBook', e)}
          onClose={()=>this.setState({isAccountBookOpened: false})}
        >
        </AccountPopUpList>
      </View>
    )
  }
}
