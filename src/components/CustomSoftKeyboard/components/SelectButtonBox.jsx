import dayjs from 'dayjs'
import { Component } from 'react'
import { View, ScrollView, Picker } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import AccountPopUpList from './AccountPopUpList'

@inject('AccountStore', 'UserStore')
@observer
export default class SelectButtonBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAccountBookOpened: false,
      accountBook: {},
      date: dayjs().format('YYYY/MM/DD'),
      time: dayjs().format('HH:mm'),
    };
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  

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

  onChange = (type, e) => {
    const { onChange } = this.props
    let value = ''
    switch(type){
      case 'time':
      case 'date':
        value = e && e.detail && e.detail && e.detail.value
        this.setState({[type]: value}, () => onChange && onChange(type, value))
        break;
      default:
        this.setState({[type]: e}, () => onChange && onChange(type, e))
    }
  }

  render () {
    const { isAccountBookOpened } = this.state
    return (
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
