const keyboardBtnCrt = [
  {
    value: '1',
    type: 'number',
  },
  {
    value: '2',
    type: 'number',
  },
  {
    value: '3',
    type: 'number',
  },
  {
    value: '0',
    icon: 'withdraw-2',
    type: 'retreat',
  },
  {
    value: '4',
    type: 'number',
  },
  {
    value: '5',
    type: 'number',
  },
  {
    value: '6',
    type: 'number',
  },
  {
    value: '+',
    type: 'operator',
  },
  {
    value: '7',
    type: 'number',
  },
  {
    value: '8',
    type: 'number',
  },
  {
    value: '9',
    type: 'number',
  },
  {
    value: '-',
    type: 'operator',
  },
  {
    value: '0',
    type: 'number',
    width: 2,
  },
  {
    value: '.',
    type: 'punctuation',
  },
  {
    value: '完成',
    type: 'complete',
  },
]

export default () => {
  return keyboardBtnCrt
}