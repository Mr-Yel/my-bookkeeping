// 账本
export interface AccountBook {
  id: string,
  name: string,
  billListId: string,
  note_taker: string,
  property: number,
}

// 账本 s
export type AccountBooks = AccountBook[]

// 单项记账记录
export type BillItem = {
  bill_name: AmountTypeTableItem['name'],
  bill_img: AmountTypeTableItem['img'],
  bill_type: AmountTypeTableItem['amount_type'],
  notes: string,
  amount: number,
  date_time: string,
  note_taker?: User
}

// 记账记录列表
export type BillList = {
  id: string,
  data: BillItem[]
}

// 账单类型
export interface AmountTypeTableItem {
  name: string,                   // 名称
  img: string,                    // 图标
  amount_type: 'in' | 'out' | 'balance'  // 类型：收入 支出 平账
}

// 账单类型列表
export type AmountTypeTable = AmountTypeTableItem[]

type User = {
  name: string,
  isCreate?: 0 | 1,
}

type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type zeroToSix = 0 | 1 | 2 | 3 | 4 | 5 | 6

type YYYY = `20${zeroToNine}${zeroToNine}`

// 月份
export type MM = `${1|0}${zeroToNine}`

type DD = `${0|1|2|3}${zeroToNine}`

type mm = `${zeroToSix}${zeroToNine}`

type ss = `${zeroToSix}${zeroToNine}`