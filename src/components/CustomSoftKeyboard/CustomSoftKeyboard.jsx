import dayjs from 'dayjs'
import { Component } from 'react'
import { View, Input, Text, ScrollView } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { MyIcon } from '@/components'
import { getNumber, checkString } from '@/utils'
import { routerGoBack } from '@/utils/router'
import getKeyboardBtnCrt from './keyboardBtnCrt'
import SelectButtonBox from './components/SelectButtonBox'

@inject('BillStore', 'UserStore')
@observer
export default class CustomSoftKeyboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      operationString: '', // 金额操作符
      curOperator: '', // 当前操作符
      amount: 0, // 金额
      notes: '', // 备注
      accountBook: {}, // 当前账本
      isAccountBookOpened: false, // 展开账本列表
      date: dayjs().format('YYYY/MM/DD'), // 日期
      time: dayjs().format('HH:mm') // 时间
    }
  }

  componentWillMount() {
    this.keyboardBtnCrt = getKeyboardBtnCrt()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

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
        break
      default:
        this.setState({ [type]: e })
        break
    }
  }

  updateValue = (data) => {
    this.setState({ notes: data.notes })
    this.setState({ amount: data.amount })
  }

  render() {
    const { amount, operationString, notes, isAccountBookOpened, accountBook } = this.state
    const { keyboardBtnCrt } = this

    return (
      <View className="CustomSoftKeyboard">
        <View className="keyboard-header">
          <Input
            type="text"
            value={notes}
            onInput={(e) => this.onChange('notes', e)}
            class="keyboard-note"
            placeholder="备注"
          />
          <View class="keyboard-amount">
            <Text class="keyboard-amount-res">￥{amount}</Text>
            {checkString(operationString, ['+', '-', '.']) && (
              <Text class="keyboard-amount-operation">{operationString}</Text>
            )}
          </View>
        </View>
        <SelectButtonBox onChange={this.onChange}></SelectButtonBox>
        <View className="keyboard-content">
          {keyboardBtnCrt &&
            keyboardBtnCrt.length &&
            keyboardBtnCrt.map((item, index) => (
              <View
                key={index}
                className="keyboard-content-item"
                style={`width: ${item.width ? item.width * 25 : 25}%;`}>
                <View className="keyboard-content-button" onClick={() => this.keyboardClick(item)}>
                  {item.type == 'retreat' && <MyIcon name={item.icon}></MyIcon>}
                  {item.type != 'retreat' && <Text>{item.value}</Text>}
                </View>
              </View>
            ))}
        </View>
      </View>
    )
  }
}
